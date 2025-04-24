import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Button, Text, Chip, useTheme, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import useResponsive from '../hooks/useResponsive';
import { createContent } from '../store/contentSlice';

const CreateContentScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  const { isLoading, error } = useSelector(state => state.contents);
  const { isAuthenticated, token } = useSelector(state => state.auth);
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('article');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const contentTypes = [
    { label: 'Article', value: 'article' },
    { label: 'Ressource', value: 'resource' },
    { label: 'Tutoriel', value: 'tutorial' }
  ];
  
  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const handlePublish = async () => {
    if (!isAuthenticated || !token) {
      setSnackbarMessage("Vous devez être connecté pour publier du contenu");
      setSnackbarVisible(true);
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }

    // Validation basique
    if (!title.trim() || !body.trim()) {
      setSnackbarMessage('Le titre et le contenu sont obligatoires');
      setSnackbarVisible(true);
      return;
    }
    
    try {
      // Appel réel à l'API via Redux
      await dispatch(createContent({ 
        title, 
        body, 
        type, 
        tags, 
        isPublic, 
        status: 'published' 
      })).unwrap();
      
      setSnackbarMessage('Contenu publié avec succès');
      setSnackbarVisible(true);
      
      // Réinitialiser le formulaire
      setTitle('');
      setBody('');
      setTag('');
      setTags([]);
      setType('article');
      
      // Navigation vers l'écran d'accueil après création
      navigation.navigate('Home');
    } catch (error) {
      setSnackbarMessage('Erreur lors de la publication: ' + (error.message || 'Erreur inconnue'));
      setSnackbarVisible(true);
    }
  };
  
  const handleSaveDraft = async () => {
    if (!isAuthenticated || !token) {
      setSnackbarMessage("Vous devez être connecté pour publier du contenu");
      setSnackbarVisible(true);
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }

    if (!title.trim()) {
      setSnackbarMessage('Le titre est obligatoire pour sauvegarder un brouillon');
      setSnackbarVisible(true);
      return;
    }
    
    try {
      // Appel réel à l'API via Redux
      await dispatch(createContent({ 
        title, 
        body, 
        type, 
        tags, 
        isPublic, 
        status: 'draft' 
      })).unwrap();
      
      setSnackbarMessage('Brouillon sauvegardé avec succès');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Erreur lors de la sauvegarde: ' + (error.message || 'Erreur inconnue'));
      setSnackbarVisible(true);
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.md,
      maxWidth: isMobile ? undefined : 800,
      width: '100%',
      alignSelf: 'center',
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    typeSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    typeChip: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    selected: {
      backgroundColor: theme.colors.primary,
    },
    selectedText: {
      color: 'white',
    },
    tagInput: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagButton: {
      marginLeft: theme.spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
    },
    tag: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    visibilityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    visibilityText: {
      marginLeft: theme.spacing.sm,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
    },
    buttonContainer: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
  });
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            label="Titre"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text>Type de contenu</Text>
          <View style={styles.typeSelector}>
            {contentTypes.map((item) => (
              <Chip
                key={item.value}
                style={[
                  styles.typeChip,
                  type === item.value && styles.selected
                ]}
                textStyle={type === item.value ? styles.selectedText : {}}
                onPress={() => setType(item.value)}
              >
                {item.label}
              </Chip>
            ))}
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            label="Contenu"
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={10}
            mode="outlined"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text>Tags</Text>
          <View style={styles.tagInput}>
            <TextInput
              label="Ajouter un tag"
              value={tag}
              onChangeText={setTag}
              mode="outlined"
              style={{ flex: 1 }}
              onSubmitEditing={handleAddTag}
            />
            <Button 
              mode="contained" 
              onPress={handleAddTag}
              style={styles.tagButton}
            >
              Ajouter
            </Button>
          </View>
          
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tagItem, index) => (
                <Chip
                  key={index}
                  style={styles.tag}
                  onClose={() => handleRemoveTag(tagItem)}
                >
                  {tagItem}
                </Chip>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.visibilityContainer}>
          <Ionicons
            name={isPublic ? "eye-outline" : "eye-off-outline"}
            size={24}
            color={theme.colors.primary}
            onPress={() => setIsPublic(!isPublic)}
          />
          <Text style={styles.visibilityText}>
            {isPublic ? "Contenu public" : "Contenu privé"}
          </Text>
        </View>
        
        <View style={styles.buttonsContainer}>
          <Button
            mode="outlined"
            onPress={handleSaveDraft}
            style={styles.buttonContainer}
            loading={isLoading}
          >
            Enregistrer brouillon
          </Button>
          <Button
            mode="contained"
            onPress={handlePublish}
            style={styles.buttonContainer}
            loading={isLoading}
          >
            Publier
          </Button>
        </View>
      </View>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

export default CreateContentScreen;