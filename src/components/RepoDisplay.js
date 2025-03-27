import React, { useEffect, useState } from 'react';

const RepoDisplay = ({ onClose }) => {
    const [repoData, setRepoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRepoData = async () => {
            try {
                const response = await fetch('https://api.github.com/repos/PabloWaehner/IQ-Test');
                if (!response.ok) {
                    throw new Error('Failed to fetch repository data');
                }
                const data = await response.json();
                setRepoData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRepoData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded shadow-lg max-w-lg w-full">
                <h2 className="text-xl mb-4">{repoData.name}</h2>
                <p>{repoData.description}</p>
                <p><strong>Stars:</strong> {repoData.stargazers_count}</p>
                <p><strong>Forks:</strong> {repoData.forks_count}</p>
                <p><strong>Language:</strong> {repoData.language}</p>
                <a href={repoData.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View on GitHub</a>
                <button onClick={onClose} className="mt-4 p-2 bg-red-500 text-white rounded">Close</button>
            </div>
        </div>
    );
};

export default RepoDisplay;
