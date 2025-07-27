import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { HabitRecord, HabitStats } from '../types';

export class HabitService {
  private static getHabitCollectionPath(userId: string) {
    return `users/${userId}/habits`;
  }

  private static getUserDocPath(userId: string) {
    return `users/${userId}`;
  }

  // Save a habit record
  static async saveHabitRecord(userId: string, record: HabitRecord): Promise<void> {
    try {
      const habitCollectionPath = this.getHabitCollectionPath(userId);
      const docRef = doc(collection(db, habitCollectionPath), record.date);
      await setDoc(docRef, record);
    } catch (error) {
      console.error('Error saving habit record:', error);
      throw error;
    }
  }

  // Get a specific habit record
  static async getHabitRecord(userId: string, date: string): Promise<HabitRecord | null> {
    try {
      const habitCollectionPath = this.getHabitCollectionPath(userId);
      const docRef = doc(db, habitCollectionPath, date);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as HabitRecord;
      }
      return null;
    } catch (error) {
      console.error('Error getting habit record:', error);
      throw error;
    }
  }

  // Get all habit records for a user
  static async getAllHabitRecords(userId: string): Promise<HabitRecord[]> {
    try {
      const habitCollectionPath = this.getHabitCollectionPath(userId);
      const q = query(
        collection(db, habitCollectionPath),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const records: HabitRecord[] = [];
      
      querySnapshot.forEach((doc) => {
        records.push(doc.data() as HabitRecord);
      });
      
      return records;
    } catch (error) {
      console.error('Error getting all habit records:', error);
      throw error;
    }
  }

  // Save user stats (current streak, longest streak)
  static async saveUserStats(userId: string, stats: { currentStreak: number; longestStreak: number }): Promise<void> {
    try {
      const userDocPath = this.getUserDocPath(userId);
      const docRef = doc(db, userDocPath);
      await setDoc(docRef, { stats }, { merge: true });
    } catch (error) {
      console.error('Error saving user stats:', error);
      throw error;
    }
  }

  // Get user stats
  static async getUserStats(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
    try {
      const userDocPath = this.getUserDocPath(userId);
      const docRef = doc(db, userDocPath);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().stats) {
        return docSnap.data().stats;
      }
      
      return { currentStreak: 0, longestStreak: 0 };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { currentStreak: 0, longestStreak: 0 };
    }
  }

  // Save user profile data
  static async saveUserProfile(userId: string, profile: { name?: string; goal?: string }): Promise<void> {
    try {
      const userDocPath = this.getUserDocPath(userId);
      const docRef = doc(db, userDocPath);
      await setDoc(docRef, { profile }, { merge: true });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // Get user profile data
  static async getUserProfile(userId: string): Promise<{ name?: string; goal?: string }> {
    try {
      const userDocPath = this.getUserDocPath(userId);
      const docRef = doc(db, userDocPath);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().profile) {
        return docSnap.data().profile;
      }
      
      return {};
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {};
    }
  }

  // Calculate habit statistics
  static calculateStats(records: HabitRecord[]): HabitStats {
    const sortedRecords = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalDays = sortedRecords.length;
    let cleanDays = 0;

    // Calculate current streak (from most recent backwards)
    const today = new Date().toISOString().split('T')[0];
    const reversedRecords = [...sortedRecords].reverse();
    
    for (const record of reversedRecords) {
      if (record.date <= today) {
        if (!record.fapped) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak and clean days
    for (const record of sortedRecords) {
      if (!record.fapped) {
        cleanDays++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalDays,
      cleanDays
    };
  }

  // Delete all user data (for account deletion)
  static async deleteUserData(userId: string): Promise<void> {
    try {
      // Delete all habit records
      const habitCollectionPath = this.getHabitCollectionPath(userId);
      const querySnapshot = await getDocs(collection(db, habitCollectionPath));
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete user document
      const userDocPath = this.getUserDocPath(userId);
      await deleteDoc(doc(db, userDocPath));
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  }
} 