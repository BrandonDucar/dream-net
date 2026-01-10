
import DreamOpsLauncher from '../components/DreamOpsLauncher';

const HomePage = () => {
  return (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#000' 
    }}>
      <DreamOpsLauncher />
    </div>
  );
};

export default HomePage;
