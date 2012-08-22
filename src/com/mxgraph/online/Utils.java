package com.mxgraph.online;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

public class Utils
{

	protected static final int IO_BUFFER_SIZE = 4 * 1024;

	/**
	 * Encoding for the deflated input stream.
	 */
	protected static final String ENCODING = "ISO-8859-1";

	/**
	 * Returns the given parameter after decoding it as an URL, base 64 decoding and
	 * inflating it to a UTF-8 String.
	 */
	public static String inflate(byte[] binary) throws IOException
	{
		StringBuffer buffer = new StringBuffer();
		try
		{
			Reader in = new BufferedReader(new InputStreamReader(
					new InflaterInputStream(new ByteArrayInputStream(binary),
							new Inflater(true)), ENCODING));
			int ch;

			while ((ch = in.read()) > -1)
			{
				buffer.append((char) ch);
			}

			in.close();

			return buffer.toString();
		}
		catch (IOException e)
		{
			e.printStackTrace();

			return null;
		}
	}

	public static void copy(InputStream in, OutputStream out)
			throws IOException
	{
		copy(in, out, IO_BUFFER_SIZE);
	}

	public static void copy(InputStream in, OutputStream out, int bufferSize)
			throws IOException
	{
		byte[] b = new byte[bufferSize];
		int read;
		while ((read = in.read(b)) != -1)
		{
			out.write(b, 0, read);
		}
	}
	
	public static String readInputStream(InputStream stream) throws IOException
	{
		BufferedReader reader = new BufferedReader(
				new InputStreamReader(stream));
		StringBuffer result = new StringBuffer();
		String tmp = reader.readLine();

		while (tmp != null)
		{
			result.append(tmp + "\n");
			tmp = reader.readLine();
		}

		reader.close();

		return result.toString();
	}

	/**
	   * Encodes the passed String as UTF-8 using an algorithm that's compatible
	   * with JavaScript's <code>encodeURIComponent</code> function. Returns
	   * <code>null</code> if the String is <code>null</code>.
	   * 
	   * @param s The String to be encoded
	   * @return the encoded String
	   */
	public static String encodeURIComponent(String s)
	{
		String result = null;

		try
		{
			result = URLEncoder.encode(s, "UTF-8").replaceAll("\\+", "%20")
					.replaceAll("\\%21", "!").replaceAll("\\%28", "(")
					.replaceAll("\\%29", ")").replaceAll("\\%7E", "~");
		}

		// This exception should never occur.
		catch (UnsupportedEncodingException e)
		{
			result = s;
		}

		return result;
	}

}
