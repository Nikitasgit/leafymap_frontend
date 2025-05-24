import { useSelector } from "react-redux";
import { selectUser, selectUserCreatorPlace } from "@/store/userSlice";
import { UserState } from "@/store/userSlice";
import { Place } from "@/types/place";

export const useUser = (): UserState => {
  return useSelector(selectUser);
};

export const useUserCreatorPlace = (): Place | null => {
  return useSelector(selectUserCreatorPlace);
};
