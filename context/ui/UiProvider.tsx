import { FC, useReducer, ReactNode } from 'react';
import { UiContext, uiReducer } from '@/context/ui';


export interface UiState {
    modalStatus: { mercadopago?: boolean, paypal?: boolean }
    sidebarMobile: boolean;
    selectedTab: number;
}

const Ui_INITIAL_STATE: UiState = {
    modalStatus: { mercadopago: false, paypal: false },
    sidebarMobile: false,
    selectedTab: 0,
}

export const UiProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, Ui_INITIAL_STATE);

    const handleChangeTab = (tabValue: number) => {
        dispatch({ type: '[Ui] - changeTabValue', payload: tabValue })
    }

    const toggleModal = (modalType: 'mercadopago' | 'paypal') => {
        dispatch({ type: '[Ui] - toggleModal', payload: modalType })
    }

    const toggleSidebar = () => {
        dispatch({ type: '[Ui] - toggleSidebarMobile' })
    }

    return (
        <UiContext.Provider value={{
            ...state,
            handleChangeTab,
            toggleSidebar,
            toggleModal,
        }}>
            {children}
        </UiContext.Provider>
    )
};