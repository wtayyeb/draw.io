/**
 * $Id: EmbedServlet.java,v 1.6 2012-07-30 11:11:25 gaudenz Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 * 
 * TODO
 * 
 * We could split the static part and the stencils into two separate requests
 * in order for multiple graphs in the pages to not load the static part
 * multiple times. This is only relevant if the embed arguments are different,
 * in which case there is a problem with parsin the graph model too soon, ie.
 * before certain stencils become available.
 * 
 * Easier solution is for the user to move the embed script to after the last
 * graph in the page and merge the stencil arguments.
 * 
 * Note: The static part is roundly 105K, the stencils are much smaller in size.
 * This means if the embed function is widely used, it will make sense to factor
 * out the static part because only stencils will change between pages.
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.utils.SystemProperty;

/**
 * Servlet implementation class OpenServlet
 */
public class EmbedServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	protected static String javascript = null;

	/**
	 * 
	 */
	protected static String stylesheet = null;

	/**
	 * 
	 */
	protected static String generalStencils = null;

	/**
	 * 
	 */
	protected static String lastModified = null;

	/**
	 * 
	 */
	protected HashMap<String, String> stencils = new HashMap<String, String>();

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public EmbedServlet()
	{
		if (lastModified == null)
		{
			// Uses deployment date as lastModified header
			String applicationVersion = SystemProperty.applicationVersion.get();
			Date uploadDate = new Date(Long.parseLong(applicationVersion
					.substring(applicationVersion.lastIndexOf(".") + 1))
					/ (2 << 27) * 1000);

			DateFormat httpDateFormat = new SimpleDateFormat(
					"EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
			lastModified = httpDateFormat.format(uploadDate);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String qs = request.getQueryString();

		if (qs != null && qs.equals("stats"))
		{
			writeStats(response);
		}
		else
		{
			// LATER: Reload if file changed
			if (javascript == null)
			{
				javascript = readFile("/js/reader.min.js");
			}

			// LATER: Reload if file changed
			if (stylesheet == null)
			{
				stylesheet = readXmlFile("/styles/default.xml");
			}

			// LATER: Reload if file changed
			if (generalStencils == null)
			{
				generalStencils = readXmlFile("/stencils/general.xml");
			}

			// Checks or sets last modified date of delivered content.
			// Date comparison not needed. Only return 304 if
			// delivered by this servlet instance.
			String modSince = request.getHeader("If-Modified-Since");

			if (modSince != null && modSince.equals(lastModified))
			{
				incrementCounter(304);
				response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
			}
			else
			{
				incrementCounter(200);
				writeEmbedResponse(request, response);
			}
		}
	}

	public void writeEmbedResponse(HttpServletRequest request,
			HttpServletResponse response) throws IOException
	{
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/javascript; charset=UTF-8");
		response.setHeader("Last-Modified", lastModified);

		OutputStream out = response.getOutputStream();
		String encoding = request.getHeader("Accept-Encoding");

		// Supports GZIP content encoding
		if (encoding != null && encoding.indexOf("gzip") >= 0)
		{
			response.setHeader("Content-Encoding", "gzip");
			out = new GZIPOutputStream(out);
		}

		// Creates XML for stencils
		String stencilsXml = getStencilsXml(request.getParameter("s"));
		PrintWriter writer = new PrintWriter(out);

		// Writes JavaScript and adds function call with
		// stylesheet and stencils as arguments 
		writer.println(javascript);
		writer.println("})('" + stylesheet + "', " + stencilsXml + ");");
		response.setStatus(HttpServletResponse.SC_OK);

		writer.flush();
		writer.close();
	}

	public String getStencilsXml(String sparam) throws IOException
	{
		StringBuffer result = new StringBuffer("['" + generalStencils + "'");

		// Processes each stencil only once
		HashSet<String> done = new HashSet<String>();

		if (sparam != null)
		{
			String[] names = sparam.split(";");

			for (int i = 0; i < names.length; i++)
			{
				if (names[i].indexOf("..") < 0 && !done.contains(names[i]))
				{
					done.add(names[i]);
					String tmp = stencils.get(names[i]);

					if (tmp == null)
					{
						tmp = readXmlFile("/stencils/" + names[i] + ".xml");

						// Cache for later use
						if (tmp != null)
						{
							stencils.put(names[i], tmp);
						}
					}

					if (tmp != null)
					{
						result.append(",'" + tmp + "'");
					}
				}
			}
		}

		result.append("]");

		return result.toString();
	}

	public void writeStats(HttpServletResponse response) throws IOException
	{
		PrintWriter writer = new PrintWriter(response.getOutputStream());
		writer.println("<html>");
		writer.println("<body>");
		writer.println("Deployed: " + lastModified);
		writer.println("<br>");

		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();

		try
		{
			Entity counter = datastore.get(KeyFactory.createKey("EmbedCounter",
					1));

			writer.println("Responses (Code 200): " + counter.getProperty("ok"));
			writer.println("<br>");
			writer.println("Responses (Code 304): "
					+ counter.getProperty("notModified"));
		}
		catch (EntityNotFoundException e)
		{
			writer.println("Responses (Code 200): 0");
			writer.println("<br>");
			writer.println("Responses (Code 304): 0");
		}
		writer.println("</body>");
		writer.println("</html>");
		writer.flush();
	}

	public String readXmlFile(String filename) throws IOException
	{
		return readFile(filename).replaceAll("\n", "").replaceAll("\t", "")
				.replaceAll("'", "\\'");
	}

	public String readFile(String filename) throws IOException
	{
		InputStream is = getServletContext().getResourceAsStream(filename);

		return Utils.readInputStream(is);
	}

	// Uses persistent datastore for stats
	public void incrementCounter(int code)
	{
		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();
		Entity counter = null;

		try
		{
			counter = datastore.get(KeyFactory.createKey("EmbedCounter", 1));
		}
		catch (EntityNotFoundException e)
		{
			counter = new Entity("EmbedCounter", 1);

			counter.setProperty("ok", 0);
			counter.setProperty("notModified", 0);
		}

		String propertyName = (code == 200) ? "ok" : "notModified";

		counter.setProperty(propertyName, Integer.parseInt(counter
				.getProperty(propertyName).toString()) + 1);

		datastore.put(counter);
	}

}
