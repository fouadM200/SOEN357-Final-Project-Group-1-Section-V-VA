import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "fitfuel_users";

export type User = {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    height: string;
    weight: string;
    phoneNumber: string;
    email: string;
    password: string;
};

export const getUsers = async (): Promise<User[]> => {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveUsers = async (users: User[]): Promise<void> => {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signupUser = async (
    newUser: User
): Promise<{ success: boolean; message?: string }> => {
    const users = await getUsers();

    const emailExists = users.find(u => u.email === newUser.email);

    if (emailExists) {
        return { success: false, message: "User already exists" };
    }

    users.push(newUser);

    await saveUsers(users);

    return { success: true };
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{ success: boolean; user?: User; message?: string }> => {
    const users = await getUsers();

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return { success: false, message: "Invalid credentials" };
    }

    return { success: true, user };
};

export const resetPassword = async (
    email: string,
    newPassword: string
): Promise<{ success: boolean; message?: string }> => {
    const users = await getUsers();

    const index = users.findIndex(u => u.email === email);

    if (index === -1) {
        return { success: false, message: "User not found" };
    }

    users[index].password = newPassword;

    await saveUsers(users);

    return { success: true };
};

export const clearAllUsers = async (): Promise<void> => {
    await AsyncStorage.removeItem(USERS_KEY);
};