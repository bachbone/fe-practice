import { useState, useEffect, useMemo, useCallback } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
};

type UserSearchProps = {
  users: User[];
  query: string;
  loading: boolean;
  error: Error | null;
}

type Filter = {
  field: keyof User,
  order: "asc" | "dsc"
}

function LoadingComponent() {
  return (
    <div>
      Loading Users...
    </div>
  )
};

function ErrorComponent({ errorMessage }: { errorMessage?: string }) {
  const message = errorMessage || "Something wrong happened. Please try again!";
  return (
    <div>
      {message}
    </div>
  )
};

function UserSearch(props: UserSearchProps) {

  const { users, loading, error, query } = props;

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return <ErrorComponent errorMessage={error.message} />
  }

  if (users.length === 0 && query.trim() !== "") {
    return (
      <div>
        <span>No user found</span>
      </div>
    );
  }

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id}>
          <div>{user.name}</div>
          <div>{user.email}</div>
          <div>{user.company.name}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<Filter | null>(null);

  useEffect(() => {

    const controller = new AbortController();

    const getUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getUserEndpoint(controller);

        setUsers(data);
      } catch (error: unknown) {
        const isErrorObject = error instanceof Error;
        if (isErrorObject && error.name === "AbortError") {
          console.log("Aborted request");
        } else {
          if (isErrorObject) {
            console.error(error.message);
            setError(error);
          } else {
            console.error("An unexpected error occurred", error);
            setError(new Error("An unexpected error occurred"));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    getUsers();

    return () => {
      controller.abort();
    }

  }, []);

  const onQueryChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
  };

  const onClear = useCallback(() => {
    setQuery("");
  }, []);

  const createSortFn = (field: Filter["field"], order: Filter["order"]) => () => {
    const filter = { field, order };
    setFilter(filter);
  };

  const resetFilter = useCallback(() => {
    setFilter(null);
  }, []);

  const queriedUsers = useMemo(() => {
    const partial = filterByQuery(users, query);
    if (filter === null) {
      return partial;
    }
    return sortByField(partial, filter.field, filter.order);
  }, [users, query, filter]);

  return (
    <div className="page-layout">
      <h1>User Directory</h1>

      {/* <div>
        query: {query}
      </div> */}

      <div className="search-bar">
        <div className="input">
          <input type="text" value={query} placeholder="search any user" onChange={onQueryChange} />
          <button onClick={onClear}>Clear</button>
        </div>
        <div className="filters">
          <button onClick={createSortFn("name", "asc")}>Sort by Name ASC</button>
          <button onClick={createSortFn("name", "dsc")}>Sort by Name DSC</button>
        </div>
        <div>
          <button onClick={resetFilter}>Reset</button>
        </div>
      </div>

      <UserSearch users={queriedUsers} query={query} loading={loading} error={error} />
    </div>
  );
}

const API_ENDPOINTS = {
  GET_USERS: "https://jsonplaceholder.typicode.com/users"
}

const getUserEndpoint = async (controller: AbortController): Promise<User[]> => {
  const response = await fetch(API_ENDPOINTS.GET_USERS, { signal: controller.signal });
  const data = await response.json();
  return data as User[];
};

const filterByQuery = (users: User[], query: string) => {
  if (users.length === 0) {
    return [];
  }

  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return users;
  }

  return users.filter(user => {
    if (!user.name || !user.email) {
      return false;
    }

    const normalizedName = user.name.trim().toLocaleLowerCase();
    const normalizedEmail = user.email.trim().toLocaleLowerCase();

    const hasName = normalizedName.includes(normalizedQuery);
    const hasEmail = normalizedEmail.includes(normalizedQuery);

    return hasName || hasEmail;

  });
};

const sortByField = (users: User[], field: keyof User, order: "asc" | "dsc") => {
  if (users.length === 0) {
    return [];
  }

  return users.toSorted((a, b) => {
    const aString = a[field].toString();
    const bString = b[field].toString();

    if (order === "asc") {
      return aString.localeCompare(bString);
    } else {
      return bString.localeCompare(aString);
    }
  });
}