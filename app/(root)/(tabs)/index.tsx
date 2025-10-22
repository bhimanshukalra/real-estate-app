import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-bold font-rubik text-3xl">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href="/sign-in" className="mt-4 px-4 py-2 bg-blue-500 rounded">
        <Text className="text-white font-rubik">Go to Sign In</Text>
      </Link>
    </View>
  );
}
