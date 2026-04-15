import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "fitfuel_users";
const CURRENT_USER_KEY = "fitfuel_current_user";

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

    const emailExists = users.find(
        (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
    );

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
        (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
    );

    if (!user) {
        return { success: false, message: "Invalid credentials" };
    }

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    return { success: true, user };
};

export const getCurrentUser = async (): Promise<User | null> => {
    const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
};

export const getCurrentUserEmail = async (): Promise<string | null> => {
    const currentUser = await getCurrentUser();
    return currentUser?.email?.toLowerCase() ?? null;
};

export const getScopedStorageKey = async (
    baseKey: string
): Promise<string | null> => {
    const email = await getCurrentUserEmail();

    if (!email) {
        return null;
    }

    return `${baseKey}_${email}`;
};

export const logoutUser = async (): Promise<void> => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

export const resetPassword = async (
    email: string,
    newPassword: string
): Promise<{ success: boolean; message?: string }> => {
    const users = await getUsers();

    const index = users.findIndex(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (index === -1) {
        return { success: false, message: "User not found" };
    }

    users[index].password = newPassword;

    await saveUsers(users);

    const currentUser = await getCurrentUser();
    if (
        currentUser &&
        currentUser.email.toLowerCase() === email.toLowerCase()
    ) {
        currentUser.password = newPassword;
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    return { success: true };
};

export const clearAllUsers = async (): Promise<void> => {
    await AsyncStorage.removeItem(USERS_KEY);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
};