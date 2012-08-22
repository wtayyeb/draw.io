package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.logging.Logger;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mxgraph.util.mxBase64;

/**
 * Servlet implementation class SaveServlet
 */
public class SaveServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	private static final Logger log = Logger.getLogger(HttpServlet.class
			.getName());

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaveServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		if (request.getContentLength() < Constants.MAX_REQUEST_SIZE)
		{
			long t0 = System.currentTimeMillis();
			String mime = null;
			String filename = null;
			byte[] data = null;

			// Data in data param is base64 encoded and deflated
			String enc = request.getParameter("data");
			String xml;

			if (enc != null && enc.length() > 0)
			{
				xml = Utils.inflate(mxBase64.decode(URLDecoder.decode(enc,
						"UTF-8")));
			}
			else
			{
				xml = request.getParameter("xml");

				if (xml != null && xml.length() > 0)
				{
					xml = URLDecoder.decode(xml, "UTF-8");
				}
			}

			if (xml != null)
			{
				mime = "application/xml";
				filename = request.getParameter("filename");

				String format = request.getParameter("format");
				
				if (format == null)
				{
					format = "xml";
				}

				if (!filename.toLowerCase().endsWith("." + format))
				{
					filename += "." + format;
				}

				data = xml.getBytes("UTF-8");
			}

			if (mime != null && filename != null && data != null)
			{

				response.setContentType(mime);
				response.setHeader("Content-Disposition",
						"attachment; filename=\"" + filename + "\"");
				response.setStatus(HttpServletResponse.SC_OK);

				OutputStream out = response.getOutputStream();
				String encoding = request.getHeader("Accept-Encoding");

				// Supports GZIP content encoding
				// TODO: Check if encoded request param can be passed through directly
				if (encoding != null && encoding.indexOf("gzip") >= 0)
				{
					response.setHeader("Content-Encoding", "gzip");
					out = new GZIPOutputStream(out);
				}

				out.write(data);
				out.flush();
				out.close();
			}
			else
			{
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			}
			long mem = Runtime.getRuntime().totalMemory()
					- Runtime.getRuntime().freeMemory();

			log.info("save: ip=" + request.getRemoteAddr() + " ref=\""
					+ request.getHeader("Referer") + "\" in="
					+ request.getContentLength() + " enc="
					+ ((enc != null) ? enc.length() : "[none]") + " xml="
					+ ((xml != null) ? xml.length() : "[none]") + " dt="
					+ request.getContentLength() + " mem=" + mem + " dt="
					+ (System.currentTimeMillis() - t0));
		}
		else
		{
			response.setStatus(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
		}
	}

}
