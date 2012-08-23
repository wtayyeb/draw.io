/**
 * $Id: OpenServlet.java,v 1.11 2012-08-23 14:41:52 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.io.mxCodec;
import com.mxgraph.io.mxVdxCodec;
import com.mxgraph.util.mxXmlUtils;
import com.mxgraph.view.mxGraph;
import com.mxgraph.view.mxGraphHeadless;

/**
 * Servlet implementation class OpenServlet
 */
public class OpenServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Global switch to enabled VDX support.
	 */
	public static boolean ENABLE_VDX_SUPPORT = true;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public OpenServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html; charset=UTF-8");

		OutputStream out = response.getOutputStream();
		String encoding = request.getHeader("Accept-Encoding");

		// Supports GZIP content encoding
		if (encoding != null && encoding.indexOf("gzip") >= 0)
		{
			response.setHeader("Content-Encoding", "gzip");
			out = new GZIPOutputStream(out);
		}

		PrintWriter writer = new PrintWriter(out);
		writer.println("<html>");
		writer.println("<body>");
		writer.println("<script type=\"text/javascript\">");

		try
		{
			if (request.getContentLength() < Constants.MAX_REQUEST_SIZE)
			{
				Map<String, String> post = parseMultipartRequest(request);
				String xml = new String(post.get("upfile").getBytes(ENCODING),
						"UTF-8");
				String filename = post.get("filename");

				// Parses Visio file
				if (ENABLE_VDX_SUPPORT
						&& filename.toLowerCase().endsWith(".vdx"))
				{
					// NOTE: On GAE this will throw java.lang.NoClassDefFoundError: Could not initialize class com.mxgraph.util.mxConstants
					// in the following line because mxGraph has dependencies on AWT
					mxGraph graph = new mxGraphHeadless();
					Document doc = mxXmlUtils.parseXml(xml);
					mxVdxCodec vdxCodec = new mxVdxCodec(doc);
					vdxCodec.setHtmlLabelsEnable(false);
					vdxCodec.decode(graph);

					mxCodec codec = new mxCodec();
					Node node = codec.encode(graph.getModel());

					// Specifies new styleshet to be used
					((Element) node).setAttribute("style", "default-style2");
					xml = mxXmlUtils.getXml(node);

					// Replaces VDX extension
					int dot = filename.lastIndexOf('.');
					filename = filename.substring(0, dot + 1) + "xml";
				}

				writer.println("window.parent.setCurrentXml(decodeURIComponent('"
						+ Utils.encodeURIComponent(xml)
						+ "'), '"
						+ filename
						+ "');");
			}
			else
			{
				writer.println("window.parent.showOpenAlert(window.parent.mxResources.get('drawingTooLarge'));");
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
			writer.println("window.parent.showOpenAlert(window.parent.mxResources.get('invalidOrMissingFile'));");
		}

		writer.println("</script>");
		writer.println("</body>");
		writer.println("</html>");

		writer.flush();
		writer.close();
	}

	//
	// Handling of multipart/form-data *** NOT FOR PRODUCTION USE!! ***
	//

	/**
	 * Encoding for the multipart/form-data.
	 */
	protected static final String ENCODING = "ISO-8859-1";

	/**
	 * Parses the given multipart/form-data request into a map that maps from
	 * names to values. Note that this implementation ignores the file type and
	 * filename and does only return the actual data as the value for the name
	 * of the file input in the form. Returns an empty map if the form does not
	 * contain any multipart/form-data.
	 */
	protected Map<String, String> parseMultipartRequest(
			HttpServletRequest request) throws IOException
	{
		Map<String, String> result = new Hashtable<String, String>();
		String contentType = request.getHeader("Content-Type");

		// Checks if the form is of the correct content type
		if (contentType != null
				&& contentType.indexOf("multipart/form-data") == 0)
		{
			// Extracts the boundary from the header
			int boundaryIndex = contentType.indexOf("boundary=");
			String boundary = "--"
					+ contentType.substring(boundaryIndex + 9).trim();

			// Splits the multipart/form-data into its different parts
			Iterator<String> it = splitFormData(
					readStream(request.getInputStream()), boundary).iterator();

			while (it.hasNext())
			{
				parsePart(it.next(), result);
			}
		}

		return result;
	}

	/**
	 * Parses the values in the given form-data part into the given map. The
	 * value of the name attribute will be used as the name for the data. The
	 * filename will be stored under filename in the given map and the
	 * content-type is ignored in this implementation.
	 */
	protected void parsePart(String part, Map<String, String> into)
	{
		String[] lines = part.split("\r\n");

		if (lines.length > 1)
		{
			// First line contains content-disposition in the following format:
			// form-data; name="upfile"; filename="avatar.jpg"
			String[] tokens = lines[1].split(";");

			// Stores the value of the name attribute for the form-data
			String name = null;

			for (int i = 0; i < tokens.length; i++)
			{
				String tmp = tokens[i];
				int index = tmp.indexOf("=");

				// Checks if the token contains a key=value pair
				if (index >= 0)
				{
					String key = tmp.substring(0, index).trim();
					String value = tmp.substring(index + 2, tmp.length() - 1);

					if (key.equals("name"))
					{
						name = value;
					}
					else
					{
						into.put(key, value);
					}
				}
			}

			// Parses all lines starting from the first empty line
			if (name != null && lines.length > 2)
			{
				boolean active = false;
				StringBuffer value = new StringBuffer();

				for (int i = 2; i < lines.length; i++)
				{
					if (active)
					{
						value.append(lines[i]);
					}
					else if (!active)
					{
						active = lines[i].length() == 0;
					}
				}

				into.put(name, value.toString());
			}
		}
	}

	/**
	 * Returns the parts of the given multipart/form-data.
	 */
	protected List<String> splitFormData(String formData, String boundary)
	{
		List<String> result = new LinkedList<String>();
		int nextBoundary = formData.indexOf(boundary);

		while (nextBoundary >= 0)
		{
			if (nextBoundary > 0)
			{
				result.add(formData.substring(0, nextBoundary));
			}

			formData = formData.substring(nextBoundary + boundary.length());
			nextBoundary = formData.indexOf(boundary);
		}

		return result;
	}

	/**
	 * Reads the complete stream into memory as a String.
	 */
	protected String readStream(InputStream is) throws IOException
	{
		if (is != null)
		{
			StringBuffer buffer = new StringBuffer();
			try
			{
				Reader in = new BufferedReader(new InputStreamReader(is,
						ENCODING));
				int ch;

				while ((ch = in.read()) > -1)
				{
					buffer.append((char) ch);
				}
			}
			finally
			{
				is.close();
			}

			return buffer.toString();
		}
		else
		{
			return "";
		}
	}

}
