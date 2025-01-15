import React from "react";

export default function SpinnerCustom() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-indigo-600"></div>
        </div>
    );
}
