import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  PropsWithChildren,
  Dispatch,
  SetStateAction
} from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
};

// 1. Separate the State Type directly so we don't have to use ["users"] indexing inline
type UsersState = User[] | null;

type UserContextType = {
  users: UsersState;
  setUsers: Dispatch<SetStateAction<UsersState>>;
  eraseUsers: () => void; // Added erasable context function signature
};

// 2. Define standard fallback functions instead of looking up object properties
const initialState: UserContextType = {
  users: null,
  setUsers: () => { },
  eraseUsers: () => { },
};

const UserContext = createContext<UserContextType>(initialState);

export function UserProvider({ children }: PropsWithChildren) {
  // 3. Pass the clean, un-nested type directly to useState
  const [users, setUsers] = useState<UsersState>(null);

  // 4. Implement the erase handler
  const eraseUsers = () => {
    setUsers(null);
  };

  // 5. Memoize the clean value references
  const value = useMemo(() => ({
    users,
    setUsers,
    eraseUsers
  }), [users]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// 6. Added custom hook to safely consume the compiled context
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
