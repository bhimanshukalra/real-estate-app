import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Query,
  TablesDB,
} from "react-native-appwrite";

export const config = {
  platform: process.env.EXPO_PUBLIC_PLATFORM_NAME,
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
};

export const client = new Client()
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const tables = new TablesDB(client);

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
      return false;
    }
    await account.deleteSession({ sessionId: "current" });
    console.log("User logged out successfully");
    return true;
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();

    if (user.$id) {
      const userAvatar = avatar.getInitialsURL(user.name);
      return { ...user, avatar: userAvatar.toString() };
    }
    return user;
  } catch (error) {
    console.error("Get Current User Error:", error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    const result = await tables.listRows({
      databaseId: config.databaseId!,
      tableId: config.propertiesCollectionId!,
      queries: [Query.orderAsc("$createdAt"), Query.limit(5)],
    });
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];
    if (filter && filter !== "All") {
      buildQuery.push(Query.equal("type", filter));
    }
    if (query) {
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );
    }
    if (limit) {
      buildQuery.push(Query.limit(limit));
    }

    const result = await tables.listRows({
      databaseId: config.databaseId!,
      tableId: config.propertiesCollectionId!,
      queries: buildQuery,
    });

    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}
