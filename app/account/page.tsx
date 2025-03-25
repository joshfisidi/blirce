import { Metadata } from "next";
import Header from "@/components/Header";
import ProfileContent from "@/components/ProfileContent";

export const metadata: Metadata = {
  title: "Blirce | Profile",
  description: "View and manage your Blirce profile",
};

export default function Profile() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            Your Profile
          </h1>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <ProfileContent />
      </div>
    </div>
  );
} 