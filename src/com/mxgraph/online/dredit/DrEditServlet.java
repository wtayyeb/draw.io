/*
 * Copyright (c) 2012 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

package com.mxgraph.online.dredit;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.google.api.services.oauth2.model.Userinfo;
import com.mxgraph.online.dredit.CredentialMediator.CodeExchangeException;
import com.mxgraph.online.dredit.CredentialMediator.NoRefreshTokenException;
import com.mxgraph.online.dredit.CredentialMediator.NoUserIdException;

/**
 * Abstract servlet that sets up credentials and provides some convenience
 * methods.
 *
 * @author vicfryzel@google.com (Vic Fryzel)
 */
public abstract class DrEditServlet extends HttpServlet
{
	protected static final HttpTransport TRANSPORT = new NetHttpTransport();

	protected static final JsonFactory JSON_FACTORY = new JacksonFactory();

	/**
	 * Default MIME type of files created or handled by DrEdit.
	 *
	 * This is also set in the Google APIs Console under the Drive SDK tab.
	 */
	public static final String DEFAULT_MIMETYPE = "application/mxe";

	/**
	 * MIME type to use when sending responses back to DrEdit JavaScript client.
	 */
	public static final String JSON_MIMETYPE = "application/json;charset=utf-8";

	/**
	 * Path component under war/ to locate client_secrets.json file.
	 */
	public static final String CLIENT_SECRETS_FILE_PATH = "/WEB-INF/client_secrets.json";

	/**
	 * Loaded data from war/WEB-INF/client_secrets.json.
	 */
	protected GoogleClientSecrets secrets;

	/**
	 * Loads the secrets.
	 */
	protected void updateSecrets()
	{
		if (secrets == null)
		{
			try
			{
				secrets = GoogleClientSecrets.load(JSON_FACTORY,
						getClientSecretsStream());
			}
			catch (IOException e)
			{
				throw new RuntimeException(
						"client_secrets.json is missing or invalid.");
			}
		}
	}

	/**
	 * Scopes for which to request access from the user.
	 */
	public static final List<String> SCOPES = Arrays.asList(
			// Required to access and manipulate files.
			"https://www.googleapis.com/auth/drive.file",
			// Required to identify the user in our data store.
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile");

	protected void sendError(HttpServletResponse resp, int code, String message)
	{
		try
		{
			resp.sendError(code, message);
		}
		catch (IOException e)
		{
			throw new RuntimeException(message);
		}
	}

	protected InputStream getClientSecretsStream()
	{
		return getServletContext()
				.getResourceAsStream(CLIENT_SECRETS_FILE_PATH);
	}

	protected CredentialMediator getCredentialMediator(HttpServletRequest req,
			HttpServletResponse resp)
			throws CredentialMediator.NoRefreshTokenException
	{
		// Authorize or fetch credentials.  Required here to ensure this happens
		// on first page load.  Then, credentials will be stored in the user's
		// session.
		updateSecrets();
		CredentialMediator mediator = new CredentialMediator(req, resp, secrets);
		mediator.getActiveCredential();
		return mediator;
	}

	protected Credential getCredential(HttpServletRequest req,
			HttpServletResponse resp)
	{
		try
		{
			CredentialMediator mediator = getCredentialMediator(req, resp);
			return mediator.getActiveCredential();
		}
		catch (CredentialMediator.NoRefreshTokenException e)
		{
			throw new RuntimeException("No refresh token found. Re-authorizing.");
		}
	}

	protected String getClientId(HttpServletRequest req,
			HttpServletResponse resp)
			throws CredentialMediator.NoRefreshTokenException
	{
		return getCredentialMediator(req, resp).getClientSecrets().getWeb()
				.getClientId();
	}

	protected void deleteCredential(HttpServletRequest req,
			HttpServletResponse resp)
	{
		try
		{
			CredentialMediator mediator = getCredentialMediator(req, resp);
			mediator.deleteActiveCredential();
		}
		catch (CredentialMediator.NoRefreshTokenException e)
		{
			throw new RuntimeException("Failed to redirect for authorization.");
		}
	}
	
	protected boolean shouldInvalidateSession(HttpServletRequest request, CredentialMediator mediator)
	{
		boolean invalidate = false;

		String authCode = request.getParameter("code");
		String sessionUserId = (String) request.getSession().getAttribute(CredentialMediator.USER_ID_KEY);

		if (authCode != null && sessionUserId != null)
		{
			try
			{
				Credential cred = mediator.exchangeCode(authCode);
				Userinfo ui = mediator.getUserInfo(cred);
				invalidate = !sessionUserId.equals(ui.getId());
			}
			catch (NoUserIdException e)
			{
				e.printStackTrace();
			}
			catch (CodeExchangeException e)
			{
				e.printStackTrace();
			}
		}

		return invalidate;
	}
	
	protected void endSession(HttpServletRequest request, HttpServletResponse response, CredentialMediator mediator) throws NoRefreshTokenException {
		mediator.deleteActiveCredential();
		request.getSession().invalidate();
		Cookie cookie = new Cookie("drive", "");
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		throw new NoRefreshTokenException();
	}
}