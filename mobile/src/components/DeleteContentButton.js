import React, { useState } from 'react';
import { IconButton, Dialog, Portal, Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContent } from '../store/contentSlice';

const DeleteContentButton = ({ contentId, authorId, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useSelector(state => state.auth);

  // Vérifier si l'utilisateur peut supprimer ce contenu
  const canDelete = user && (user.role === 'admin' || user.id === authorId);

  // Si l'utilisateur ne peut pas supprimer, ne pas afficher le bouton
  if (!canDelete) {
    return null;
  }

  const showDeleteDialog = () => setDialogVisible(true);
  const hideDeleteDialog = () => setDialogVisible(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteContent(contentId)).unwrap();
      hideDeleteDialog();
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const styles = StyleSheet.create({
    deleteButton: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)', // Rouge semi-transparent
    },
    dialogContent: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    dialogActions: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      justifyContent: 'space-between',
    }
  });

  return (
    <>
      <IconButton 
        icon="delete" 
        mode="contained-tonal"
        iconColor="#F44336"
        style={styles.deleteButton}
        size={20}
        onPress={showDeleteDialog}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Supprimer cet article</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <Text>Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={hideDeleteDialog}>Annuler</Button>
            <Button
              mode="contained"
              loading={isDeleting}
              disabled={isDeleting}
              buttonColor="#F44336"
              textColor="white"
              onPress={handleDelete}
            >
              Supprimer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default DeleteContentButton;