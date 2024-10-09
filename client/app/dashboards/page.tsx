// app/dashboard/page.tsx

import Home from './Home';
import ProtectedRoute from '../../components/ProtectedRoute';

const DashboardPage = () => {
    return (
        <>
            <div style={{ backgroundColor: '#E6EEF2' }}>
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
            </div>
        </>
    );
};

export default DashboardPage;
