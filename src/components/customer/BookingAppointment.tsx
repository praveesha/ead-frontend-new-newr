import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Snackbar, Alert } from '@mui/material';
import { postJSON } from '../../config';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';

type FormState = {
    date: string;
    time: string;
    vehicleType: string;
    vehicleNumber: string;
    service: string;
    notes: string;
};

const initialForm: FormState = {
    date: '',
    time: '',
    vehicleType: '',
    vehicleNumber: '',
    service: '',
    notes: '',
};

// Define default time slots
const defaultTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
    '15:00', '15:30', '16:00', '16:30', '17:00'
];

export default function BookingAppointment() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dateInputRef = useRef<HTMLInputElement | null>(null);
    const [customTimeSlot, setCustomTimeSlot] = useState<string | null>(null);

    // Auto-fill form from URL parameters (for reschedule links)
    useEffect(() => {
        const date = searchParams.get('date');
        const time = searchParams.get('time');
        const vehicleType = searchParams.get('vehicleType');
        const vehicleNumber = searchParams.get('vehicleNumber');
        const service = searchParams.get('service');
        const isReschedule = searchParams.get('reschedule');

        if (isReschedule === 'true') {
            // Check if the time from URL is not in default slots
            if (time && !defaultTimeSlots.includes(time)) {
                setCustomTimeSlot(time);
            }

            setForm((prev) => ({
                ...prev,
                ...(date && { date }),
                ...(time && { time }),
                ...(vehicleType && { vehicleType }),
                ...(vehicleNumber && { vehicleNumber }),
                ...(service && { service }),
            }));

            // Show info message
            setSnackbarMessage('Form auto-filled from reschedule link. Please review and confirm.');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
        }
    }, [searchParams]);

    function onChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target as HTMLInputElement;
        setForm((s) => ({ ...s, [name]: value }));
        setErrors((err) => {
            if (!err[name]) return err;
            const next = { ...err };
            delete next[name];
            return next;
        });
    }

    function validate(values: FormState) {
        const next: Record<string, string> = {};
        if (!values.date) next.date = 'Please select a date.';
        if (!values.time) next.time = 'Please select a time.';
        if (!values.service) next.service = 'Please choose a service type.';
        return next;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const next = validate(form);
        if (Object.keys(next).length) {
            setErrors(next);
            const firstKey = Object.keys(next)[0];
            const el = (document.getElementsByName(firstKey)[0] as HTMLElement | undefined);
            el?.focus?.();
            return;
        }

        // Build payload matching backend expectations
        const rawUser = localStorage.getItem('user');
        let userId: string | number | null = null;
        try {
            if (rawUser) {
                const parsed = JSON.parse(rawUser);
                if (parsed && typeof parsed === 'object' && 'id' in parsed) {
                    userId = (parsed as { id: string | number }).id ?? null;
                }
            }
        } catch (err) {
            // ignore parse errors and leave userId as null
            console.warn('Failed to parse user from localStorage', err);
        }

        const payload = {
            date: form.date, // YYYY-MM-DD
            time: form.time, // HH:mm
            vehicleType: form.vehicleType || null,
            vehicleNumber: form.vehicleNumber || null,
            service: form.service,
            instructions: form.notes || null,
            employeeId: null, // assigned later by backend/staff
            userId,
            status: 'pending',
        };

        try {
            setLoading(true);
            // POST to /appointments — ensure your backend endpoint matches
            const res = await postJSON('/appointments', payload);
            setSnackbarMessage('Your appointment has been created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setForm(initialForm);
            setErrors({});
            console.log('Appointment created', res);
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create appointment';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    }

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
       <div className="min-h-screen bg-bg-tertiary">
        <Navbar />
         <section className="py-12 sm:py-16 lg:py-20 px-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 animate-fade-in">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
                    <CalendarTodayIcon className="text-primary" sx={{ fontSize: { xs: 28, sm: 32 } }} />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-2 sm:mb-3">
                    Book a Service Appointment
                </h1>
                <p className="text-text-tertiary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                    Schedule your vehicle service in just a few steps. We'll take care of the rest.
                </p>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-bg-primary rounded-2xl border border-border-primary p-6 sm:p-8 lg:p-10 shadow-2xl animate-fade-in" 
                     style={{ animationDelay: '0.1s' }}>
                    <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CalendarTodayIcon className="text-primary" sx={{ fontSize: 14 }} />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-text-primary">When do you need service?</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <label className="flex flex-col text-left group">
                                    <span className="text-xs sm:text-sm font-medium text-text-secondary mb-2 group-focus-within:text-primary transition-colors">
                                        Select Date <span className="text-primary">*</span>
                                    </span>
                                    <div className="relative">
                                        <input
                                            name="date"
                                            ref={dateInputRef}
                                            value={form.date}
                                            onChange={onChange}
                                            type="date"
                                            aria-invalid={!!errors.date}
                                            aria-describedby={errors.date ? 'err-date' : undefined}
                                            required
                                            className={`bg-bg-secondary text-text-primary placeholder-text-muted rounded-lg px-4 pr-12 h-11 sm:h-12 border ${
                                                errors.date ? 'border-primary' : 'border-border-primary'
                                            } w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm`}
                                            autoComplete="off"
                                        />
                                        <button
                                            type="button"
                                            aria-label="Open calendar"
                                            onClick={() => dateInputRef.current?.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current?.focus()}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md text-text-tertiary hover:text-primary hover:bg-primary/10 transition-colors"
                                        >
                                            <CalendarTodayIcon fontSize="small" />
                                        </button>
                                    </div>
                                    {errors.date && (
                                        <span className="text-xs text-primary mt-1.5 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                                            {errors.date}
                                        </span>
                                    )}
                                </label>

                                <label className="flex flex-col text-left group">
                                    <span className="text-xs sm:text-sm font-medium text-text-secondary mb-2 group-focus-within:text-primary transition-colors">
                                        Preferred Time <span className="text-primary">*</span>
                                    </span>
                                    <select
                                        name="time"
                                        value={form.time}
                                        onChange={onChange}
                                        aria-invalid={!!errors.time}
                                        aria-describedby={errors.time ? 'err-time' : undefined}
                                        required
                                        className={`bg-bg-secondary text-text-primary rounded-lg px-4 pr-10 h-11 sm:h-12 border ${
                                            errors.time ? 'border-primary' : 'border-border-primary'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer text-sm`}
                                        style={{
                                            appearance: 'none',
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'none',
                                            backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23A1A1AA\'><path d=\'M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 0 1 1.08 1.04l-4.25 4.25a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z\'/></svg>")',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '16px',
                                            backgroundPosition: 'right 1rem center'
                                        }}
                                    >
                                        <option value="">Choose a time slot</option>
                                        {/* Show custom time slot first if it exists */}
                                        {customTimeSlot && (
                                            <option key={customTimeSlot} value={customTimeSlot}>
                                                {customTimeSlot} (Rescheduled Time)
                                            </option>
                                        )}
                                        {/* Default time slots */}
                                        {defaultTimeSlots.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    {errors.time && (
                                        <span className="text-xs text-primary mt-1.5 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                                            {errors.time}
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border-primary"></div>

                        {/* Vehicle Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                    <DirectionsCarIcon className="text-primary" sx={{ fontSize: 14 }} />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-text-primary">Vehicle Details</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <label className="flex flex-col text-left group">
                                    <span className="text-xs sm:text-sm font-medium text-text-secondary mb-2 group-focus-within:text-primary transition-colors">
                                        Vehicle Type
                                    </span>
                                    <select 
                                        name="vehicleType" 
                                        value={form.vehicleType} 
                                        onChange={onChange} 
                                        className="bg-bg-secondary text-text-primary rounded-lg px-4 pr-10 h-11 sm:h-12 border border-border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer text-sm"
                                        style={{
                                            appearance: 'none',
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'none',
                                            backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23A1A1AA\'><path d=\'M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 0 1 1.08 1.04l-4.25 4.25a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z\'/></svg>")',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '16px',
                                            backgroundPosition: 'right 1rem center'
                                        }}
                                    >
                                        <option value="">Select vehicle type</option>
                                        <option value="car">🚗 Car</option>
                                        <option value="van">🚐 Van</option>
                                        <option value="jeep">🚙 Jeep/SUV</option>
                                        <option value="cab">🚕 Cab</option>
                                        <option value="truck">🚚 Truck</option>
                                    </select>
                                </label>

                                <label className="flex flex-col text-left group">
                                    <span className="text-xs sm:text-sm font-medium text-text-secondary mb-2 group-focus-within:text-primary transition-colors">
                                        Vehicle Number
                                    </span>
                                    <input
                                        name="vehicleNumber"
                                        value={form.vehicleNumber}
                                        onChange={onChange}
                                        placeholder="e.g., ABC-1234"
                                        autoComplete="off"
                                        className="bg-bg-secondary text-text-primary placeholder-text-muted rounded-lg px-4 h-11 sm:h-12 border border-border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border-primary"></div>

                        {/* Service Type Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                    <BuildIcon className="text-primary" sx={{ fontSize: 14 }} />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-text-primary">What service do you need?</h3>
                            </div>

                            <label className="flex flex-col text-left group">
                                <span className="text-xs sm:text-sm font-medium text-text-secondary mb-2 group-focus-within:text-primary transition-colors">
                                    Service Type <span className="text-primary">*</span>
                                </span>
                                <select 
                                    name="service" 
                                    value={form.service} 
                                    onChange={onChange} 
                                    aria-invalid={!!errors.service} 
                                    aria-describedby={errors.service ? 'err-service' : undefined} 
                                    required 
                                    className={`bg-bg-secondary text-text-primary rounded-lg px-4 pr-10 h-11 sm:h-12 border ${
                                        errors.service ? 'border-primary' : 'border-border-primary'
                                    } w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer text-sm`}
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23A1A1AA\'><path d=\'M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 0 1 1.08 1.04l-4.25 4.25a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z\'/></svg>")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '16px',
                                        backgroundPosition: 'right 1rem center'
                                    }}
                                >
                                    <option value="">Choose service type</option>
                                    <option value="maintenance">🔧 Regular Maintenance</option>
                                    <option value="repair">⚙️ Repair Service</option>
                                    <option value="inspection">🔍 Vehicle Inspection</option>
                                    <option value="diagnostics">💻 Diagnostics</option>
                                    <option value="oil_change">🛢️ Oil Change</option>
                                    <option value="tire_service">🛞 Tire Service</option>
                                </select>
                                {errors.service && (
                                    <span className="text-xs text-primary mt-1.5 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-primary rounded-full"></span>
                                        {errors.service}
                                    </span>
                                )}
                            </label>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border-primary"></div>

                        {/* Additional Instructions Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                    <DescriptionIcon className="text-primary" sx={{ fontSize: 14 }} />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-text-primary">Additional Information</h3>
                            </div>

                            <label className="flex flex-col text-left group">
                                <span className="text-xs sm:text-sm font-medium text-text-secondary mb-2 group-focus-within:text-primary transition-colors">
                                    Special Instructions or Notes
                                </span>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={onChange}
                                    rows={4}
                                    placeholder="Tell us about any specific issues or requirements (optional)"
                                    className="bg-bg-secondary text-text-primary placeholder-text-muted rounded-lg px-4 py-3 border border-border-primary w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm"
                                />
                                <span className="text-xs text-text-muted mt-1.5">
                                    {form.notes.length} / 500 characters
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                            <button 
                                type="button" 
                                onClick={() => navigate(-1)} 
                                className="flex-1 h-11 sm:h-12 flex items-center justify-center bg-bg-secondary border border-border-primary text-text-primary rounded-lg font-semibold hover:bg-bg-tertiary hover:border-border-strong transition-all text-sm"
                            >
                                Back
                            </button>
                            <button 
                                type="submit" 
                                disabled={!form.date || !form.time || !form.service || loading} 
                                className={`flex-1 h-11 sm:h-12 flex items-center justify-center rounded-lg font-semibold transition-all text-sm ${
                                    !form.date || !form.time || !form.service || loading
                                        ? 'bg-primary text-white cursor-not-allowed' 
                                        : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-primary/30'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <CheckCircleIcon sx={{ fontSize: 18 }} />
                                        Confirm Appointment
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Help Text */}
                        <div className="text-center pt-4 border-t border-border-primary">
                            <p className="text-xs sm:text-sm text-text-muted">
                                Need help? Contact us at{' '}
                                <a href="tel:+94123456789" className="text-primary hover:text-primary-light transition-colors">
                                    +94 123 456 789
                                </a>
                                {' '}or{' '}
                                <a href="mailto:support@autoservice.com" className="text-primary hover:text-primary-light transition-colors">
                                    support@autoservice.com
                                </a>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-bg-primary border border-border-primary rounded-xl p-4 text-center hover:border-primary/50 transition-all">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckCircleIcon className="text-primary" sx={{ fontSize: 20 }} />
                        </div>
                        <h4 className="text-text-primary font-semibold mb-1 text-sm">Quick Response</h4>
                        <p className="text-text-tertiary text-xs">We'll confirm within 24 hours</p>
                    </div>
                    <div className="bg-bg-primary border border-border-primary rounded-xl p-4 text-center hover:border-primary/50 transition-all">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <BuildIcon className="text-primary" sx={{ fontSize: 20 }} />
                        </div>
                        <h4 className="text-text-primary font-semibold mb-1 text-sm">Expert Service</h4>
                        <p className="text-text-tertiary text-xs">Certified technicians</p>
                    </div>
                    <div className="bg-bg-primary border border-border-primary rounded-xl p-4 text-center hover:border-primary/50 transition-all">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CalendarTodayIcon className="text-primary" sx={{ fontSize: 20 }} />
                        </div>
                        <h4 className="text-text-primary font-semibold mb-1 text-sm">Flexible Scheduling</h4>
                        <p className="text-text-tertiary text-xs">Choose your preferred time</p>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
        
        <Snackbar 
            open={snackbarOpen} 
            autoHideDuration={6000} 
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert 
                onClose={handleSnackbarClose} 
                severity={snackbarSeverity} 
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbarMessage}
            </Alert>
        </Snackbar>
       </div>
    );
}
