import React, { useEffect, useState, useReducer } from 'react';
import {IntlProvider} from "react-intl"
import zh_CN from './locale/zh_CN';
import en_US from './locale/en_US';
import { getBrowserLanguage } from './util'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './components/MLSQLHeader'
import routers from './router'
import { AuthContext } from './context/Auth';
import initService from './service/handleService'
    const initialState = {
        email: '',
        username: ''
    };
    const reducer = (state, action) => {
        switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                email: action.payload.email,
                username: action.payload.username
            };
        case 'LOGOUT':
            return {
                ...state,
                email: '',
                username: ''
            };
        default:
            return state;
        }
    };
let isInitial = false;

const App = () => {
    const history = useHistory();
    const [lang, changeLang] = useState('zh')
    const [messages, changeMessage] = useState(zh_CN)

    const handleLocaleChange = (lang) => {
        changeLang(lang)
        changeMessage(lang === 'zh' ? zh_CN : en_US)
    }

    useEffect(() => {
        const language = getBrowserLanguage()
        const lang = language.includes('zh') ? 'zh' : 'en'
        handleLocaleChange(lang)
    }, [])

    const [state, dispatch] = useReducer(reducer, initialState);

    if (!isInitial) {
        initService(history, dispatch);
        isInitial = true;
    }

    return (
        <IntlProvider locale={lang} messages={messages}>
            <AuthContext.Provider value={{
                state,
                dispatch
            }}>
                <div className="App">
                    
                        <Header onLocaleChange={handleLocaleChange}/>
                        <Switch>
                        {
                            routers.map(router=>{
                                const Component = router.component;
                                return (
                                    <Route
                                        exact
                                        path={router.path}
                                        key={router.path}
                                    >
                                        {/* <Header onLocaleChange={handleLocaleChange}/> */}
                                        <Component />
                                    </Route>
                                )
                            })
                        }
                        <Route exact path="/">
                            <Redirect to="/home" /> 
                        </Route>
                        </Switch>
                </div>
        </AuthContext.Provider>
        </IntlProvider>
    );
}

export default App;
