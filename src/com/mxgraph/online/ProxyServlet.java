/**
 * $Id: ProxyServlet.java,v 1.1 2012-06-30 01:48:03 gaudenz Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation ProxyServlet
 */
public class ProxyServlet extends HttpServlet
{

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ProxyServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String urlParam = request.getParameter("url");

		if (urlParam != null)
		{
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");
			response.setContentType("application/xml; charset=UTF-8");

			OutputStream out = response.getOutputStream();
			String encoding = request.getHeader("Accept-Encoding");

			// Supports GZIP content encoding
			if (encoding != null && encoding.indexOf("gzip") >= 0)
			{
				response.setHeader("Content-Encoding", "gzip");
				out = new GZIPOutputStream(out);
			}

			try
			{
				URL url = new URL(urlParam);
				Utils.copy(url.openStream(), out);
				out.flush();
				out.close();
			}
			catch (Exception e)
			{
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			}
		}
		else
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

}
