/*
 * Copyright (c) 2012 Google Inc.
 * Copyright (c) 2012 JGraph Ltd.
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

package com.mxgraph.online.drive;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpResponseException;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.oauth2.model.Userinfo;
import com.google.gson.Gson;
import com.mxgraph.online.drive.CredentialMediator.CodeExchangeException;
import com.mxgraph.online.drive.CredentialMediator.NoRefreshTokenException;
import com.mxgraph.online.drive.CredentialMediator.NoUserIdException;
import com.mxgraph.online.drive.model.ClientFile;

/**
 * Servlet providing a small API for the DrEdit JavaScript client to use in
 * manipulating files.  Each operation (GET, POST, PUT) issues requests to the
 * Google Drive API.
 *
 * @author vicfryzel@google.com (Vic Fryzel)
 */
@SuppressWarnings("serial")
public class FileServlet extends HttpServlet
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
	 * Scopes for which to request access from the user.
	 */
	public static final List<String> SCOPES = Arrays.asList(
			// Required to access and manipulate files.
			"https://www.googleapis.com/auth/drive.file",
			// Required to identify the user in our data store.
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/drive.install");


	protected final static String APP_INSTALL_URL = "https://chrome.google.com/webstore/detail/bghopifpoccdfeinlciloipnlpnkmnmo";

	/**
	 * Given a {@code file_id} URI parameter, return a JSON representation
	 * of the given file.
	 */
	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
	{
		Drive service = null;
		if (req.getParameter("status") != null)
		{
			boolean isValid = false;
			CredentialMediator credentialMediator = null;

			try
			{
				credentialMediator = getCredentialMediator(req, resp);
				boolean isEndSession = shouldInvalidateSession(req, credentialMediator);
				if (isEndSession)
				{
					endSession(req, resp, credentialMediator);
				}

				String userId = (String) req.getSession().getAttribute(CredentialMediator.USER_ID_KEY);

				if (userId != null && credentialMediator != null && credentialMediator.getStoredCredential(userId) != null)
				{
					isValid = true;
				}

			}
			catch (Exception e)
			{
				e.printStackTrace();
			}

			if (isValid)
			{
				resp.setStatus(200);
				HttpSession session = req.getSession();
				Userinfo ui = new Userinfo();
				ui.setEmail((String) session.getAttribute(CredentialMediator.EMAIL_KEY));
				ui.setId((String) session.getAttribute(CredentialMediator.USER_ID_KEY));
				JSONObject json = new JSONObject(ui);
				resp.getWriter().write(json.toString());
			}
			else
			{
				resp.setStatus(500);
				try
				{
					resp.getWriter().write(getAuthorizationUrl(req, false));
				}
				catch (Exception ex)
				{
					throw new RuntimeException("Failed to redirect for authorization.");
				}
			}
		}
		else
		{
			try
			{
				CredentialMediator credentialMediator = getCredentialMediator(req, resp);
				boolean isEndSession = shouldInvalidateSession(req, credentialMediator);
				if (isEndSession)
				{
					endSession(req, resp, credentialMediator);
				}

				service = getDriveService(req, resp, credentialMediator);

				String fileId = req.getParameter("file_id");

				if (fileId == null)
				{
					sendError(resp, 400, "The `file_id` URI parameter must be specified.");
					return;
				}

				File file = null;
				try
				{
					file = service.files().get(fileId).execute();
				}
				catch (GoogleJsonResponseException e)
				{
					if (e.getStatusCode() == 401)
					{
						// The user has revoked our token or it is otherwise bad.
						// Delete the local copy so that their next page load will recover.
						deleteCredential(req, resp);
						sendError(resp, 401, "Unauthorized");
						return;
					}
					else if (e.getStatusCode() == 403)
					{
						resp.getWriter().write(getAuthorizationUrl(req, false));
						return;
					}
				}

				if (file != null)
				{
					String content = downloadFileContent(service, file);
					if (content == null)
					{
						content = "";
					}
					resp.setContentType(JSON_MIMETYPE);
					String userId = (String) req.getSession().getAttribute(CredentialMediator.USER_ID_KEY);
					String email = (String) req.getSession().getAttribute(CredentialMediator.EMAIL_KEY);
					ClientFile cf = new ClientFile(file, content);
					JSONObject json = new JSONObject();
					json.put("resource_id", cf.resource_id);
					json.put("title", cf.title);
					json.put("description", cf.description);
					json.put("mimeType", cf.mimeType);
					json.put("content", cf.content);
					json.put("email", email);
					json.put("id", userId);

					resp.getWriter().print(json.toString());
				}
				else
				{
					sendError(resp, 404, "File not found");
				}
			}
			catch (Exception e)
			{
				//e.printStackTrace();
				resp.setStatus(500);
				try
				{
					resp.getWriter().write(getAuthorizationUrl(req, false));
				}
				catch (Exception ex)
				{
					throw new RuntimeException("Failed to redirect for authorization.");
				}
			}
		}
	}

	/**
	 * Retrieve the authorization URL to authorize the user with the given
	 * email address.
	 *
	 * @param emailAddress User's e-mail address.
	 * @return Authorization URL to redirect the user to.
	 */
	public String getAuthorizationUrl(HttpServletRequest request, boolean ignoreState)
	{
		// Generate an authorization URL based on our client settings,
		// the user's email address, and the state parameter, if present.
		updateSecrets();
		GoogleAuthorizationCodeRequestUrl urlBuilder = new GoogleAuthorizationCodeRequestUrl(secrets.getWeb().getClientId(), secrets.getWeb().getRedirectUris().get(0), SCOPES)
				.setAccessType("offline").setApprovalPrompt("force");
		// Propagate through the current state parameter, so that when the
		// user gets redirected back to our app, they see the file(s) they
		// were originally supposed to see before we realized we weren't
		// authorized.
		if (!ignoreState && request.getParameter("state") != null)
		{
			urlBuilder.set("state", request.getParameter("state"));
		}

		if (request.getSession() != null)
		{
			String emailAddress = (String) request.getSession().getAttribute(CredentialMediator.EMAIL_KEY);

			if (emailAddress != null)
			{
				urlBuilder.set("user_id", emailAddress);
			}
		}

		return urlBuilder.build();
	}

	/**
	 * Create a new file given a JSON representation, and return the JSON
	 * representation of the created file.
	 */
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException
	{
		try
		{
			CredentialMediator cm = getCredentialMediator(req, resp);
			ClientFile clientFile = new ClientFile(req.getReader());
			//user can initiate a Save from logged out tab, we log out the other users to allow saving any unsaved work
			if (clientFile.userId != null && !clientFile.userId.equals(req.getSession().getAttribute(CredentialMediator.USER_ID_KEY)))
			{
				endSession(req, resp, cm);
			}

			Drive service = getDriveService(req, resp, cm);

			File file = clientFile.toFile();

			if (!clientFile.content.equals(""))
			{
				file = service.files().insert(file, ByteArrayContent.fromString(clientFile.mimeType, clientFile.content)).execute();
				
			}
			else
			{
				file = service.files().insert(file).execute();
			}

			resp.setContentType(JSON_MIMETYPE);
			resp.getWriter().print(new Gson().toJson(file.getId()).toString());
		}
		catch (Exception e)
		{
			resp.setStatus(500);
			if (e instanceof GoogleJsonResponseException)
			{
				GoogleJsonResponseException e2 = (GoogleJsonResponseException) e;
				resp.setStatus(e2.getStatusCode());
			}
			try
			{
				resp.getWriter().write(getAuthorizationUrl(req, true));
			}
			catch (Exception ex)
			{
				throw new RuntimeException("Failed to redirect for authorization.");
			}
		}
	}

	/**
	 * Update a file given a JSON representation, and return the JSON
	 * representation of the created file.
	 */
	@Override
	public void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException
	{
		try
		{ 
			CredentialMediator cm = getCredentialMediator(req, resp);
			ClientFile clientFile = new ClientFile(req.getReader());
			//user can initiate a Save from logged out tab, we log out the other users to allow saving any unsaved work
			if (clientFile.userId != null && !clientFile.userId.equals(req.getSession().getAttribute(CredentialMediator.USER_ID_KEY)))
			{
				endSession(req, resp, cm);
			}

			Drive service = getDriveService(req, resp, cm);
			File file = clientFile.toFile();
			file = service.files().update(clientFile.resource_id, file, ByteArrayContent.fromString(clientFile.mimeType, clientFile.content)).execute();

			resp.setContentType(JSON_MIMETYPE);
			resp.getWriter().print(new Gson().toJson(file.getId()).toString());
		}
		catch (Exception e)
		{
			resp.setStatus(500);
			if (e instanceof GoogleJsonResponseException)
			{
				GoogleJsonResponseException e2 = (GoogleJsonResponseException) e;
				resp.setStatus(e2.getStatusCode());
			}
			try
			{
				resp.getWriter().write(getAuthorizationUrl(req, true));
			}
			catch (Exception ex)
			{
				throw new RuntimeException("Failed to redirect for authorization.");
			}
		}
	}

	/**
	 * Download the content of the given file.
	 *
	 * @param service Drive service to use for downloading.
	 * @param file File metadata object whose content to download.
	 * @return String representation of file content.  String is returned here
	 *         because this app is setup for text/plain files.
	 * @throws IOException Thrown if the request fails for whatever reason.
	 */
	private String downloadFileContent(Drive service, File file) throws IOException
	{
		GenericUrl url = new GenericUrl(file.getDownloadUrl());
		HttpResponse response = service.getRequestFactory().buildGetRequest(url).execute();
		try
		{
			return new Scanner(response.getContent(), "UTF-8").useDelimiter("\\A").next();
		}
		catch (java.util.NoSuchElementException e)
		{
			return "";
		}
	}

	/**
	 * Build and return a Drive service object based on given request parameters.
	 *
	 * @param req Request to use to fetch code parameter or accessToken session
	 *            attribute.
	 * @param resp HTTP response to use for redirecting for authorization if
	 *             needed.
	 * @return Drive service object that is ready to make requests, or null if
	 *         there was a problem.
	 * @throws IOException 
	 */
	private Drive getDriveService(HttpServletRequest req, HttpServletResponse resp, CredentialMediator mediator) throws CredentialMediator.NoRefreshTokenException, IOException
	{
		Credential credentials = mediator.getActiveCredential();

		return Drive.builder(TRANSPORT, JSON_FACTORY).setHttpRequestInitializer(credentials).build();
	}
	
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
			throws CredentialMediator.NoRefreshTokenException, IOException
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
			HttpServletResponse resp) throws IOException
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
			throws CredentialMediator.NoRefreshTokenException, IOException
	{
		return getCredentialMediator(req, resp).getClientSecrets().getWeb()
				.getClientId();
	}

	protected void deleteCredential(HttpServletRequest req,
			HttpServletResponse resp) throws IOException
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
	
	protected void endSession(HttpServletRequest request, HttpServletResponse response, CredentialMediator mediator) throws NoRefreshTokenException, IOException {
		mediator.deleteActiveCredential();
		request.getSession().invalidate();
		Cookie cookie = new Cookie("drive", "");
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		throw new NoRefreshTokenException();
	}
}