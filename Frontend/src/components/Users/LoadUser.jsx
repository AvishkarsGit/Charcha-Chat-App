import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";

function LoadUser({ user, onSelect }) {
  const handleClick = async () => {
    onSelect();
  };
  return (
    <div
      key={user?._id}
      onClick={handleClick}
      className="flex items-center w-100 my-3 p-2 hover:bg-gray-300 hover:cursor-pointer hover:rounded-xl"
    >
      <Avatar className={`h-12 w-12`}>
        <AvatarImage
          src={
            user?.photo
              ? user?.photo
              : `https://img.freepik.com/free-photo/young-handsome-man-wearing-casual-tshirt-blue-background-happy-face-smiling-with-crossed-arms-looking-camera-positive-person_839833-12963.jpg?semt=ais_hybrid&w=740&q=80`
          }
        />
      </Avatar>
      <div className=" ml-4">
        <h3 className="font-medium">{user?.name}</h3>
        <p className="font-semibold text-gray-700 text-[1rem]">{user?.email}</p>
      </div>
    </div>
  );
}

export default LoadUser;
