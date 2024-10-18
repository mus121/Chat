import Home from './Home';
import HomePage from './HomePage';
import styles from './scss/home.module.scss';
const DashboardPage = () => {
    return (
        <>
            <div className={styles.backgroungHome}>
            <Home/>
            {/* <HomePage/> */}
            </div>
        </>
    );
};

export default DashboardPage;
