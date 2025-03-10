import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Protected({ children, authentication }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector(state => state.auth.status);

    useEffect(() => {
        // Simplified navigation logic
        if (authentication && authStatus !== authentication) {
            console.log("Redirecting to login...");
            navigate("/login");
        } else if (!authentication && authStatus !== authentication) {
            console.log("Redirecting to home...");
            navigate("/");
        }
        setLoader(false);
    }, [authStatus, navigate, authentication]);

    return loader ? <h1>Loading...</h1> : <>{children}</>;
}

Protected.propTypes = {
    children: PropTypes.node.isRequired,
    authentication: PropTypes.bool,
};
