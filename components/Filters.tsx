import { categories } from "@/constants/data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

const Filters = () => {
  const params = useLocalSearchParams<{ filter?: string }>();
  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "All"
  );

  const CategoryItem = ({
    currentCategory,
  }: {
    currentCategory: {
      title: string;
      category: string;
    };
  }) => {
    const handleCategoryPress = () => {
      if (selectedCategory === currentCategory.category) {
        setSelectedCategory("All");
        router.setParams({ filter: "All" });
      } else {
        setSelectedCategory(currentCategory.category);
        router.setParams({ filter: currentCategory.category });
      }
    };

    return (
      <TouchableOpacity
        onPress={handleCategoryPress}
        className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${selectedCategory === currentCategory.category ? "bg-primary-300" : "bg-primary-100 border border-primary-200"}`}
      >
        <Text
          className={`text-sm ${selectedCategory === currentCategory.category ? "text-white font-rubik-bold mt-0.5" : "text-black-300 font-rubik"}`}
        >
          {currentCategory.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {categories.map((item) => (
        <CategoryItem key={item.category} currentCategory={item} />
      ))}
    </ScrollView>
  );
};

export default Filters;
