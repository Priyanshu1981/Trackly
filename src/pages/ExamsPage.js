import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import './ExamsPage.css';

const ExamsPage = () => {
  const { user, getExams, addExam, updateExam, deleteExam, addTopic, toggleTopicCompletion, deleteTopic } = useContext(UserContext);
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState('');
  const [examDate, setExamDate] = useState('');
  const [expandedExam, setExpandedExam] = useState(null);
  const [newTopic, setNewTopic] = useState({});

  useEffect(() => {
    if (user) {
      loadExams();
    }
  }, [user]);

  const loadExams = async () => {
    const examsData = await getExams();
    setExams(examsData);
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    if (newExam.trim() && examDate) {
      await addExam(newExam, examDate);
      setNewExam('');
      setExamDate('');
      loadExams();
    }
  };

  const handleAddTopic = async (examId) => {
    if (newTopic[examId]?.trim()) {
      await addTopic(examId, newTopic[examId]);
      setNewTopic({ ...newTopic, [examId]: '' });
      loadExams();
    }
  };

  const handleToggleTopic = async (examId, topicId) => {
    await toggleTopicCompletion(examId, topicId);
    loadExams();
  };

  const handleDeleteTopic = async (examId, topicId) => {
    await deleteTopic(examId, topicId);
    loadExams();
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Delete this exam?')) {
      await deleteExam(examId);
      loadExams();
    }
  };

  const getDaysLeft = (examDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    
    const diffTime = exam - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays; // Can be negative if exam is in the past
  };

  const getDaysLeftDisplay = (examDate) => {
    const daysLeft = getDaysLeft(examDate);
    if (daysLeft < 0) {
      return 'Expired';
    }
    return `${daysLeft} days`;
  };

  const isExpired = (examDate) => {
    return getDaysLeft(examDate) < 0;
  };

  const getProgress = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completed = topics.filter(t => t.completed).length;
    return Math.round((completed / topics.length) * 100);
  };

  return (
    <div className="exams-page">
      <h1>📚 Exams Planning</h1>

      <form onSubmit={handleAddExam} className="exam-form">
        <input
          type="text"
          placeholder="Exam/Subject name"
          value={newExam}
          onChange={(e) => setNewExam(e.target.value)}
          required
        />
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          required
        />
        <button type="submit">Add Exam</button>
      </form>

      <div className="exams-list">
        {exams.length === 0 ? (
          <p>No exams planned yet. Add one to get started!</p>
        ) : (
          exams.map((exam) => {
            const iExp = isExpired(exam.examDate);
            const isExpanded = expandedExam === exam.id;
            const progress = getProgress(exam.topics);
            const daysLeftDisplay = getDaysLeftDisplay(exam.examDate);

            return (
              <div key={exam.id} className={`exam-card ${isExpanded ? 'expanded' : ''} ${iExp ? 'expired' : ''}`}>
                {/* Collapsed View */}
                <div className="exam-collapsed">
                  <div className="exam-info">
                    <h3>{exam.subject}</h3>
                    <div className="exam-meta">
                      <span className="exam-date">📅 {new Date(exam.date).toLocaleDateString()}</span>
                      <span className={`days-left ${iExp ? 'expired' : getDaysLeft(exam.examDate) < 7 ? 'urgent' : ''}`}>
                        ⏰ {daysLeftDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-mini">
                    <div className="progress-bar-small">
                      <div className="progress-fill-small" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">{progress}%</span>
                  </div>

                  <div className="exam-actions">
                    <button
                      className="expand-btn"
                      onClick={() => setExpandedExam(isExpanded ? null : exam.id)}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="exam-expanded">
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Topics Progress</span>
                        <span className="progress-percent">{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="topic-count">
                        {exam.topics?.filter(t => t.completed).length || 0}/{exam.topics?.length || 0} topics completed
                      </p>
                    </div>

                    <div className="topics-section">
                      <div className="add-topic-form">
                        <input
                          type="text"
                          placeholder="Add new topic..."
                          value={newTopic[exam.id] || ''}
                          onChange={(e) => setNewTopic({ ...newTopic, [exam.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTopic(exam.id);
                            }
                          }}
                        />
                        <button onClick={() => handleAddTopic(exam.id)}>+ Add</button>
                      </div>

                      <div className="topics-list">
                        {exam.topics && exam.topics.length > 0 ? (
                          exam.topics.map((topic) => (
                            <div key={topic.id} className="topic-item">
                              <input
                                type="checkbox"
                                checked={topic.completed}
                                onChange={() => handleToggleTopic(exam.id, topic.id)}
                              />
                              <span className={topic.completed ? 'completed' : ''}>
                                {topic.name}
                              </span>
                              <button
                                className="topic-delete"
                                onClick={() => handleDeleteTopic(exam.id, topic.id)}
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="no-topics">No topics added yet. Click + Add to start!</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
