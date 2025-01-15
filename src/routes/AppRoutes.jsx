import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Platform from "../pages/Platform";
import Store from "../pages/Store";
import Genre from "../pages/Genre";
import GameDetailPage from "../components/GameDetailPage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Results from "../pages/Results";
import AppLayout from "../layouts/AppLayout";
import Profile from '../pages/Profile';
import FavoritesPage from '../pages/FavoritesPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/platform/:platformId" element={<Platform />} />
                <Route path="/store/:storeId" element={<Store />} />
                <Route path="/genre/:genreId" element={<Genre />} />
                <Route path="/game/:id" element={<GameDetailPage />} />
                <Route path="/results" element={<Results />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
