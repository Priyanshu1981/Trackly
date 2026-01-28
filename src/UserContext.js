import React, { createContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { auth, db } from './firebase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auth methods
  const signup = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const signin = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Tasks
  const getTasks = () => {
    return new Promise((resolve) => {
      if (!user) {
        resolve([]);
        return;
      }

      const q = query(collection(db, 'todos'), where('uid', '==', user.uid));
      onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        resolve(tasksData);
      });
    });
  };

  const addTask = async (text) => {
    if (!user) return;
    return await addDoc(collection(db, 'todos'), {
      uid: user.uid,
      text: text,
      completed: false,
      createdAt: new Date()
    });
  };

  const updateTask = async (taskId, updates) => {
    if (!user) return;
    const taskRef = doc(db, 'todos', taskId);
    return await updateDoc(taskRef, updates);
  };

  const deleteTask = async (taskId) => {
    if (!user) return;
    return await deleteDoc(doc(db, 'todos', taskId));
  };

  // Habits
  const getHabits = () => {
    return new Promise((resolve) => {
      if (!user) {
        resolve([]);
        return;
      }

      const q = query(collection(db, 'habits'), where('uid', '==', user.uid));
      onSnapshot(q, (snapshot) => {
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        resolve(habitsData);
      });
    });
  };

  const addHabit = async (name) => {
    if (!user) return;
    return await addDoc(collection(db, 'habits'), {
      uid: user.uid,
      name: name,
      streak: 0,
      days: {},
      createdAt: new Date()
    });
  };

  const updateHabit = async (habitId, updates) => {
    if (!user) return;
    const habitRef = doc(db, 'habits', habitId);
    return await updateDoc(habitRef, updates);
  };

  const deleteHabit = async (habitId) => {
    if (!user) return;
    return await deleteDoc(doc(db, 'habits', habitId));
  };

  // Exams
  const getExams = () => {
    return new Promise((resolve) => {
      if (!user) {
        resolve([]);
        return;
      }

      const q = query(collection(db, 'subjects'), where('uid', '==', user.uid));
      onSnapshot(q, (snapshot) => {
        const examsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        resolve(examsData);
      });
    });
  };

  const addExam = async (name, examDate) => {
  if (!user) return;
  return await addDoc(collection(db, 'subjects'), {
    uid: user.uid,
    subject: name,        // Changed from 'name' to 'subject' to match your DB
    date: examDate,       // Changed from 'examDate' to 'date' to match your DB
    topics: [],
    createdAt: new Date()
  });
};


  const updateExam = async (examId, updates) => {
    if (!user) return;
    const examRef = doc(db, 'subjects', examId);
    return await updateDoc(examRef, updates);
  };

  const deleteExam = async (examId) => {
    if (!user) return;
    return await deleteDoc(doc(db, 'subjects', examId));
  };

  // Topics
  const addTopic = async (examId, topicName) => {
    if (!user) return;
    const examRef = doc(db, 'subjects', examId);
    const exam = (await Promise.resolve(getExams())).find(e => e.id === examId);
    const topics = exam?.topics || [];
    return await updateDoc(examRef, {
      topics: [...topics, { id: Date.now(), name: topicName, completed: false }]
    });
  };

  const toggleTopicCompletion = async (examId, topicId) => {
    if (!user) return;
    const examRef = doc(db, 'subjects', examId);
    const exam = (await Promise.resolve(getExams())).find(e => e.id === examId);
    const updatedTopics = exam?.topics.map(t => 
      t.id === topicId ? { ...t, completed: !t.completed } : t
    ) || [];
    return await updateDoc(examRef, { topics: updatedTopics });
  };

  const deleteTopic = async (examId, topicId) => {
    if (!user) return;
    const examRef = doc(db, 'subjects', examId);
    const exam = (await Promise.resolve(getExams())).find(e => e.id === examId);
    const updatedTopics = exam?.topics.filter(t => t.id !== topicId) || [];
    return await updateDoc(examRef, { topics: updatedTopics });
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      signup,
      signin,
      logout,
      getTasks,
      addTask,
      updateTask,
      deleteTask,
      getHabits,
      addHabit,
      updateHabit,
      deleteHabit,
      getExams,
      addExam,
      updateExam,
      deleteExam,
      addTopic,
      toggleTopicCompletion,
      deleteTopic
    }}>
      {children}
    </UserContext.Provider>
  );
};
