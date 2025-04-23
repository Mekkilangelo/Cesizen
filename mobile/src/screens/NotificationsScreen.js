import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Divider, List, IconButton, Button, Chip, useTheme, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import useResponsive from '../hooks/useResponsive';

const NotificationsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nouveau commentaire',
      message: 'Jean a commenté votre diagnostic',
      date: new Date(Date.now() - 1800000).toISOString(),
      type: 'comment',
      isRead: false,
      data: { diagnosticId: 1 }
    },
    {
      id: 2,
      title: 'Rappel',
      message: 'N\'oubliez pas de compléter votre diagnostic',
      date: new Date(Date.now() - 86400000).toISOString(),
      type: 'reminder',
      isRead: true,
      data: { diagnosticId: 2 }
    },
    {
      id: 3,
      title: 'Nouvel article disponible',
      message: 'Comment améliorer la productivité de votre entreprise',
      date: new Date(Date.now() - 172800000).toISOString(),
      type: 'content',
      isRead: false,
      data: { contentId: 1 }
    },
    {
      id: 4,
      title: 'Mise à jour de l\'application',
      message: 'Découvrez les nouvelles fonctionnalités de CesiZen',
      date: new Date(Date.now() - 259200000).toISOString(),
      type: 'system',
      isRead: true,
      data: { url: 'https://example.com/update' }
    }
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'à l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days === 1) return 'hier';
      if (days < 7) return `il y a ${days} jours`;
      return date.toLocaleDateString();
    }
  };

  const getIconName = (type) => {
    switch (type) {
      case 'comment':
        return 'chatbubble';
      case 'reminder':
        return 'alarm';
      case 'content':
        return 'document-text';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'comment':
        return theme.colors.primary;
      case 'reminder':
        return theme.colors.warning;
      case 'content':
        return theme.colors.info;
      case 'system':
        return theme.colors.secondary;
      default:
        return theme.colors.placeholder;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'comment':
      case 'reminder':
        navigation.navigate('DiagnosticDetail', { id: notification.data.diagnosticId });
        break;
      case 'content':
        navigation.navigate('ContentDetail', { id: notification.data.contentId });
        break;
      case 'system':
        // Ouvrir un lien ou afficher des informations système
        alert('Information système');
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const renderItem = ({ item }) => (
    <Surface 
      style={[
        styles.notificationItem, 
        !item.isRead && styles.unreadItem
      ]}
    >
      <List.Item
        title={item.title}
        description={item.message}
        left={props => (
          <View style={[styles.iconContainer, { backgroundColor: `${getIconColor(item.type)}20` }]}>
            <Ionicons name={getIconName(item.type)} size={24} color={getIconColor(item.type)} />
          </View>
        )}
        right={props => (
          <View style={styles.rightContainer}>
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
        )}
        onPress={() => handleNotificationPress(item)}
        style={styles.listItem}
      />
    </Surface>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
    },
    markAllButton: {
      marginLeft: theme.spacing.sm,
    },
    filterContainer: {
      flexDirection: 'row',
      padding: theme.spacing.sm,
      paddingTop: 0,
    },
    chip: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    notificationItem: {
      marginBottom: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      elevation: 1,
    },
    unreadItem: {
      backgroundColor: '#F0F9FF',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },
    rightContainer: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    dateText: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginTop: theme.spacing.xs,
    },
    listItem: {
      paddingVertical: theme.spacing.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.fontSize.title,
      color: theme.colors.placeholder,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Button
          mode="text"
          onPress={markAllAsRead}
          style={styles.markAllButton}
          compact
        >
          Tout marquer comme lu
        </Button>
      </View>
      
      <View style={styles.filterContainer}>
        <Chip 
          style={styles.chip} 
          selected 
          mode="outlined"
          onPress={() => {}}
        >
          Toutes
        </Chip>
        <Chip 
          style={styles.chip} 
          mode="outlined"
          onPress={() => {}}
        >
          Non lues
        </Chip>
      </View>
      
      <Divider />
      
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingVertical: theme.spacing.sm 
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color={theme.colors.placeholder} />
            <Text style={styles.emptyText}>
              Vous n'avez pas de notifications
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default NotificationsScreen;
