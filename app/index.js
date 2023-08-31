import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Promise } from "bluebird";

Promise.config({ cancellation: true });
const UserContext = createContext();

function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: "Tarik" });
    }, 2000);
  });
}

// A container component. It shares state information
// with child components using a context.
function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    id: 0,
    name: "...",
  });

  useEffect(() => {
    fetchUser().then((user) => {
      setUser({
        id: user.id,
        name: user.name,
      });
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Renders a <Text> component that includes the user name.
// The name is obtained from the context provided by the
// UserContextProvider. As the name changes the UI is updated.
function UserInfo() {
  const user = useContext(UserContext);

  return <Text>User name is {user.name}</Text>;
}

export default function App() {
  const [course] = useState("React Native");
  const [year] = useState(1967);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Loading ...");
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const userPromise = fetchUser().then((user) => {
      setId(user.id);
      setName(user.name);
      setStatus("Ready ...");
      setResolved(true);
    });

    return () => {
      // Cancel the promise to fetch the user.
      // Promises do not support cancellation but we could use "bluebird"
      userPromise.cancel();
    };
  }, [resolved]);

  return (
    <View>
      <Text>Welcome to {course}</Text>
      <Text>Established in {year}</Text>
      <Text>What is your name?</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>ID: {id}</Text>
      <Text>Name: {name}</Text>
      <Text>Status: {status}</Text>
      <UserContextProvider>
        <View>
          <UserInfo />
        </View>
        <View>
          <UserInfo />
        </View>
        <View>
          <UserInfo />
        </View>
      </UserContextProvider>
    </View>
  );
}
