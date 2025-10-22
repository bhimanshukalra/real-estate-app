import {
  Account,
  Avatars,
  Client,
  Models,
  OAuthProvider,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: process.env.EXPO_PUBLIC_PLATFORM_NAME,
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client()
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = account.createOAuth2Token({
      provider: OAuthProvider.Google,
      success: redirectUri,
      failure: redirectUri,
    });

    if (!response) {
      throw new Error("Failed to initiate OAuth2 login");
    }
    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success") {
      throw new Error("OAuth2 login was not successful");
    }

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) {
      throw new Error("Missing secret or userId in OAuth2 response");
    }

    await account.createSession({
      userId: userId,
      secret: secret,
    });

    return true;
  } catch (error) {
    console.error("Login Error:", error);
    return false;
  }
}

export async function logout() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.warn("No active user session to log out from");
      return;
    }
    await account.deleteSession({ sessionId: user.$id });
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();

    if (user.$id) {
      const userAvatar = await avatar.getInitials({
        name: user.name,
        width: 100,
        height: 100,
      });
      return { ...user, avatarUrl: userAvatar };
    }
    return user;
  } catch (error) {
    console.error("Get Current User Error:", error);
    return null;
  }
}
