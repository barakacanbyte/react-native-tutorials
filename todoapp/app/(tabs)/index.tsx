import { Link } from "expo-router";
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme, { ColorScheme } from "@/hooks/useThemes";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { createHomeStyles } from "@/assets/styles/home.styles";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "@/components/EmptyState";

type Todo = Doc<"todos">

export default function Index() {
  const { toggleDarkMode, colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  //Queries
  const todos = useQuery(api.todos.getTodos);
  const addTodo = useMutation(api.todos.addTodo);
  const clearAllTodos = useMutation(api.todos.clearAllTodos);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  const [editText, setEditText] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<Id<"todos"> | null>(null);

  const isLoading = todos === undefined;

  if(isLoading) return <LoadingSpinner/>;

  const handleToggleTodo = async (id:Id<"todos">) => {
    try {
      await toggleTodo({id:id})
    } catch (error) {
      Alert.alert("Error", "Failed to toggle todo", [{text: "OK"}]);
    }
  }

  const handleDeleteTodo = async (id:Id<"todos">) => {
    Alert.alert("Delete todo", "Are you sure you want to delete this task?",
      [
        {text: "Cancel", style: "cancel"},
        {text: "Delete", style: "destructive", 
          onPress: async () => {
            try {
              await deleteTodo({id:id})
            } catch (error) {
              Alert.alert("Error", "Failed to delete todo", [{text: "OK"}]);
            }
          }
        }
      ]
    )
  }

  const handleEditTodo = async (todo: Todo) => {
    setEditText(todo.text);
    setSelectedTodo(todo._id);
  }

  const handleSaveEdit = async () => {
    if(selectedTodo) {
      try {
        await updateTodo({id:selectedTodo, text:editText})
      } catch (error) {
        Alert.alert("Error", "Failed to update todo", [{text: "OK"}]);
      }
    }
    setSelectedTodo(null);
    setEditText("");
  }

  const handleCancelEdit = () => {
    setSelectedTodo(null);
    setEditText("");
  }


  const renderTodoItem = ({item} : {item: Todo}) => {
    const isEditing = selectedTodo === item._id;
    return (
      <View style={homeStyles.todoItemWrapper}>
        <LinearGradient 
          colors={colors.gradients.surface}
          style={homeStyles.todoItem}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          <TouchableOpacity
          style={homeStyles.checkbox}
          activeOpacity={0.7}
          onPress={() => {
            handleToggleTodo(item._id)
          }}
          >
            <LinearGradient
            colors={item.isCompleted ? colors.gradients.success : colors.gradients.muted}
            style={[homeStyles.checkboxInner, {borderColor: item.isCompleted ? "transparent" : colors.border}]}
            >
              {item.isCompleted && <Ionicons name="checkmark" size={18} color="#fff" />}
            </LinearGradient>

          </TouchableOpacity>
          {
            isEditing ? (
              <View style={homeStyles.editContainer}>
                <TextInput
                style={homeStyles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                placeholder="Edit your todo..."
                placeholderTextColor={colors.textMuted}
                />
                <View style={homeStyles.editButtons}>
                  <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                    <LinearGradient colors={colors.gradients.success} style={homeStyles.editButton}>
                      <Ionicons name="checkmark" size={16} color="#fff"/>
                      <Text style={homeStyles.editButtonText}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8}>
                    <LinearGradient colors={colors.gradients.muted} style={homeStyles.editButton}>
                      <Ionicons name="close" size={16} color="#fff"/>
                      <Text style={homeStyles.editButtonText}>Cancel</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              
            ) : (
               <View
            style={homeStyles.todoTextContainer}
            >
            <Text
              style={[homeStyles.todoText, item.isCompleted && 
              {
                textDecorationLine: "line-through",
                color: colors.textMuted,
                opacity: 0.6,
              }
            ]}
            >
              {item.text}
            </Text>
            <View style={homeStyles.todoActions}>
              <TouchableOpacity onPress={() => {
                handleEditTodo(item);
              }}>
                <LinearGradient
                colors={colors.gradients.warning}
                style={homeStyles.actionButton}
                >
                <Ionicons name="pencil" size={14} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                handleDeleteTodo(item._id)
              }}>
                <LinearGradient
                colors={colors.gradients.danger}
                style={homeStyles.actionButton}
                >
                <Ionicons name="trash" size={14} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
            )
          }
         
        </LinearGradient>
      </View>
    )
  }

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={homeStyles.container}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />
        <TodoInput />
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item._id}
          style={homeStyles.todoList}
          contentContainerStyle={homeStyles.todoListContent}
          ListEmptyComponent={<EmptyState/>}
          // showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
