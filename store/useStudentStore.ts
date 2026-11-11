import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "../lib/storage";

export interface StudentSession {
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  targetExam: string;
  enrolledSubjectIds: string[];
  hasOnboarded: boolean;
  totalStudyMinutes: number;
}

interface StudentStoreState extends StudentSession {
  setSession: (session: Partial<StudentSession>) => void;
  setUserId: (userId: string | null) => void;
  setEnrolledSubjects: (subjectIds: string[]) => void;
  addEnrolledSubject: (subjectId: string) => void;
  removeEnrolledSubject: (subjectId: string) => void;
  setOnboarded: (status: boolean) => void;
  addStudyMinutes: (minutes: number) => void;
  resetSession: () => void;
}

const initialState: StudentSession = {
  userId: null,
  firstName: "Student",
  lastName: "User",
  email: null,
  targetExam: "JAMB",
  enrolledSubjectIds: [],
  hasOnboarded: false,
  totalStudyMinutes: 0,
};

export const useStudentStore = create<StudentStoreState>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: (session) => set((state) => ({ ...state, ...session })),
      setUserId: (userId) => set({ userId }),
      setEnrolledSubjects: (enrolledSubjectIds) => set({ enrolledSubjectIds }),
      addEnrolledSubject: (subjectId) =>
        set((state) => ({
          enrolledSubjectIds: state.enrolledSubjectIds.includes(subjectId)
            ? state.enrolledSubjectIds
            : [...state.enrolledSubjectIds, subjectId],
        })),
      removeEnrolledSubject: (subjectId) =>
        set((state) => ({
          enrolledSubjectIds: state.enrolledSubjectIds.filter((id) => id !== subjectId),
        })),
      setOnboarded: (hasOnboarded) => set({ hasOnboarded }),
      addStudyMinutes: (minutes) =>
        set((state) => ({ totalStudyMinutes: state.totalStudyMinutes + minutes })),
      resetSession: () => set(initialState),
    }),
    {
      name: "passcbt_student_store",
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
