/**
 * $Id: IconFinderServlet.java,v 1.4 2012-07-24 08:23:19 gaudenz Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.net.URL;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;

/**
 * Servlet implementation class OpenServlet
 */
public class IconFinderServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	public static final String API_KEY_FILE_PATH = "/WEB-INF/iconfinder_key";

	/**
	 * API key for iconfinder.
	 */
	public static String API_KEY = null;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public IconFinderServlet()
	{
		super();
	}

	/**
	 * Loaded data from war/WEB-INF/client_secrets.json.
	 */
	protected GoogleClientSecrets secrets;

	/**
	 * Loads the key.
	 */
	protected void updateKey()
	{
		if (API_KEY == null)
		{
			try
			{
				API_KEY = Utils.readInputStream(
						getServletContext().getResourceAsStream(
								API_KEY_FILE_PATH)).replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("API key file path invalid.");
			}
		}
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
	{
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
	{
		updateKey();

		try
		{
			URL url = new URL("http://www.iconfinder.com/xml/search/?q="
					+ Utils.encodeURIComponent(request.getParameter("q"))
					+ "&p=" + request.getParameter("p") + "&c="
					+ request.getParameter("c") + "&min=4&max=130&api_key="
					+ API_KEY);
			Utils.copy(url.openStream(), response.getOutputStream());
			response.getOutputStream().flush();
			response.getOutputStream().close();
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
	}
}
