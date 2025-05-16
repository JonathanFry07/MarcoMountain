import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftSquare } from "lucide-react";

const BackToTracking = () => {
  return (
    <div>
      <Link to="/tracking">
        <ArrowLeftSquare
          className="h-6 w-6 cursor-pointer text-gray-600 hover:text-cyan-600"
        />
      </Link>
    </div>
  );
};

export default BackToTracking;
