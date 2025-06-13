import React from "react";
import { Card, CardContent, Button } from "@/Components/ui"
import { Edit, LogOut } from "lucide-react";

import { useUserActions } from "@/hooks/user"
import {useStore} from "@/store"

const ProfilePage: React.FC = () => {
    const { user } = useStore();
    const token = useStore?.getState()?.getToken();
    const {useGetUser} = useUserActions(token)
    const { data } = useGetUser(user?._id);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
            <div className="flex flex-col items-center text-center">
            <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-sm"
            />
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">John Doe</h2>
            <p className="text-gray-500">johndoe@gmail.com</p>
            <p className="text-gray-600 mt-1">+123 456 7890</p>
            </div>
            <CardContent className="mt-6">
            <div className="space-y-4">
                <Button className="w-full flex items-center gap-2" variant="outline">
                <Edit size={16} /> Edit Profile
                </Button>
                <Button className="w-full flex items-center gap-2" variant="destructive">
                <LogOut size={16} /> Logout
                </Button>
            </div>
            </CardContent>
        </Card>
        </div>
    );
};

export { ProfilePage };
