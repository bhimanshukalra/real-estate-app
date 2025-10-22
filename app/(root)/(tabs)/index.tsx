import Filters from "@/components/Filters";
import { FeaturedPropertyCard, PropertyCard } from "@/components/PropertyCard";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useGlobalContext();

  const currentUserAvatarSource = { uri: user?.avatar };

  const Header = () => (
    <View className="flex flex-row items-center justify-between mt-5">
      <View className="flex flex-row items-center">
        <Image
          source={currentUserAvatarSource}
          className="size-12 rounded-full"
        />
        <View className="flex flex-col items-start ml-2 justify-center">
          <Text className="text-xs font-rubik text-black-100">
            Good Morning
          </Text>
          <Text className="text-base font-rubik-medium text-black-300">
            {user?.name}
          </Text>
        </View>
      </View>
      <Image source={icons.bell} className="size-6" />
    </View>
  );

  const FeaturedSection = () => (
    <View className="my-5">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
        <TouchableOpacity>
          <Text className="text-base font-rubik-bold text-primary-300">
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={[1, 2, 3]}
        renderItem={({ item }) => <FeaturedPropertyCard />}
        keyExtractor={(item) => item.toString()}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex gap-5 mt-5"
      />
    </View>
  );

  const RecommendationSection = () => (
    <View className="my-5">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-rubik-bold text-black-300">
          Our recommendation
        </Text>
        <TouchableOpacity>
          <Text className="text-base font-rubik-bold text-primary-300">
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <Filters />
    </View>
  );

  return (
    <SafeAreaView className="bg-white h-full px-5">
      <FlatList
        data={[1, 2]}
        renderItem={({ item }) => <PropertyCard />}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Header />
            <Search />
            <FeaturedSection />
            <RecommendationSection />
          </>
        }
      />
    </SafeAreaView>
  );
}
