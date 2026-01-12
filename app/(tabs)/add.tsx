import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AddScreen() {
  const router = useRouter();

  useEffect(() => {
    // Automatically navigate to add-transaction
    router.replace('/add-transaction');
  }, []);

  return null;
}