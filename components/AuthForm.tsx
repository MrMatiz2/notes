"use client";
import { useState, FormEvent, useEffect } from "react";

interface AuthFormProps {
    mode: "Signup" | "Login";
    onSubmit: (data: { email: string; password: string, name: string }) => void;
    resetForm?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, resetForm }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        if (resetForm) {
            setEmail("");
            setPassword("");
            setName("");
        }
    }, [resetForm]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ email, password, name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2>{mode}</h2>
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label>
                Password
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
             <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">
                {mode}
            </button>
        </form>
    );
};

export default AuthForm;