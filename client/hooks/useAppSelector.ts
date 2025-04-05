import { useSelector, TypedUseSelectorHook } from "react-redux"
import type { RootState } from "../state/redux"

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector 