package com.mxgraph.imageexport;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

public class Utils
{

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

}
