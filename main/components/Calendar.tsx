import { useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type CalendarProps = {
    onDateChange?: (date: Date) => void;
};

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const PICKER_SIDE_PADDING = 14;

function getDaysInMonth(year: number, monthIndex: number) {
    return new Date(year, monthIndex + 1, 0).getDate();
}

function getShortWeekday(year: number, monthIndex: number, day: number) {
    return new Date(year, monthIndex, day).toLocaleDateString("en-US", {
        weekday: "short",
    });
}

function isSameDay(first: Date, second: Date) {
    return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    );
}

function getCenteredIndex(offsetY: number, maxIndex: number) {
    const rawIndex = Math.round(offsetY / ITEM_HEIGHT);
    return Math.max(0, Math.min(rawIndex, maxIndex));
}

export default function Calendar({ onDateChange }: CalendarProps) {
    const today = useMemo(() => new Date(), []);
    const currentYear = today.getFullYear();

    const years = useMemo(
        () => Array.from({ length: 21 }, (_, index) => currentYear - 10 + index),
        [currentYear]
    );

    const [selectedDate, setSelectedDate] = useState(today);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [tempMonth, setTempMonth] = useState(today.getMonth());
    const [tempYear, setTempYear] = useState(today.getFullYear());

    const monthListRef = useRef<FlatList<string>>(null);
    const yearListRef = useRef<FlatList<number>>(null);
    const daysScrollRef = useRef<ScrollView>(null);

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const selectedDay = selectedDate.getDate();

    const days = useMemo(() => {
        const totalDays = getDaysInMonth(selectedYear, selectedMonth);

        return Array.from({ length: totalDays }, (_, index) => {
            const dayNumber = index + 1;

            return {
                dayNumber,
                weekday: getShortWeekday(selectedYear, selectedMonth, dayNumber),
            };
        });
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        onDateChange?.(selectedDate);
    }, [selectedDate, onDateChange]);

    useEffect(() => {
        const selectedIndex = selectedDay - 1;
        const cardWidth = 74;
        const cardGap = 10;
        const offset = Math.max(0, selectedIndex * (cardWidth + cardGap) - 135);

        const timer = setTimeout(() => {
            daysScrollRef.current?.scrollTo({
                x: offset,
                animated: false,
            });
        }, 80);

        return () => clearTimeout(timer);
    }, [selectedDay, selectedMonth, selectedYear]);

    const openPicker = () => {
        setTempMonth(selectedMonth);
        setTempYear(selectedYear);
        setPickerVisible(true);

        setTimeout(() => {
            monthListRef.current?.scrollToOffset({
                offset: selectedMonth * ITEM_HEIGHT,
                animated: false,
            });

            const yearIndex = years.findIndex((year) => year === selectedYear);

            if (yearIndex !== -1) {
                yearListRef.current?.scrollToOffset({
                    offset: yearIndex * ITEM_HEIGHT,
                    animated: false,
                });
            }
        }, 50);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const applyPicker = () => {
        const maxDay = getDaysInMonth(tempYear, tempMonth);
        const safeDay = Math.min(selectedDay, maxDay);

        setSelectedDate(new Date(tempYear, tempMonth, safeDay));
        setPickerVisible(false);
    };

    const handleSelectDay = (day: number) => {
        setSelectedDate(new Date(selectedYear, selectedMonth, day));
    };

    const handleMonthMomentumEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = getCenteredIndex(
            event.nativeEvent.contentOffset.y,
            MONTHS.length - 1
        );
        setTempMonth(index);
    };

    const handleYearMomentumEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = getCenteredIndex(
            event.nativeEvent.contentOffset.y,
            years.length - 1
        );
        setTempYear(years[index]);
    };

    const renderMonthItem = ({ item, index }: { item: string; index: number }) => {
        const active = tempMonth === index;

        return (
            <View style={styles.wheelItem}>
                <Text style={[styles.wheelText, active && styles.wheelTextActive]}>
                    {item}
                </Text>
            </View>
        );
    };

    const renderYearItem = ({ item }: { item: number }) => {
        const active = tempYear === item;

        return (
            <View style={styles.wheelItem}>
                <Text style={[styles.wheelText, active && styles.wheelTextActive]}>
                    {item}
                </Text>
            </View>
        );
    };

    return (
        <View>
            <View style={styles.topRow}>
                <TouchableOpacity
                    style={styles.monthPill}
                    onPress={openPicker}
                    activeOpacity={0.85}
                >
                    <Text style={styles.monthText}>
                        {MONTHS[selectedMonth]} {selectedYear}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#8D8D8D" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.todayButton}
                    onPress={goToToday}
                    activeOpacity={0.85}
                >
                    <Text style={styles.todayButtonText}>Today</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={daysScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daysRow}
            >
                {days.map((item) => {
                    const itemDate = new Date(
                        selectedYear,
                        selectedMonth,
                        item.dayNumber
                    );
                    const isActive = isSameDay(itemDate, selectedDate);

                    return (
                        <Pressable
                            key={`${selectedYear}-${selectedMonth}-${item.dayNumber}`}
                            onPress={() => handleSelectDay(item.dayNumber)}
                            style={[styles.dayCard, isActive && styles.dayCardActive]}
                        >
                            <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                                {item.weekday}
                            </Text>
                            <Text style={[styles.dateText, isActive && styles.dateTextActive]}>
                                {item.dayNumber}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <Modal
                visible={pickerVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setPickerVisible(false)}
                    />

                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setPickerVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>Choose month and year</Text>

                            <TouchableOpacity onPress={applyPicker}>
                                <Text style={styles.doneText}>Done</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.wheelsWrapper}>
                            <View style={styles.wheelContainer}>
                                <FlatList
                                    ref={monthListRef}
                                    data={MONTHS}
                                    keyExtractor={(item) => item}
                                    renderItem={renderMonthItem}
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={ITEM_HEIGHT}
                                    decelerationRate="fast"
                                    bounces={false}
                                    scrollEventThrottle={16}
                                    onMomentumScrollEnd={handleMonthMomentumEnd}
                                    getItemLayout={(_, index) => ({
                                        length: ITEM_HEIGHT,
                                        offset: ITEM_HEIGHT * index,
                                        index,
                                    })}
                                    contentContainerStyle={styles.wheelContent}
                                />
                            </View>

                            <View style={styles.wheelContainer}>
                                <FlatList
                                    ref={yearListRef}
                                    data={years}
                                    keyExtractor={(item) => item.toString()}
                                    renderItem={renderYearItem}
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={ITEM_HEIGHT}
                                    decelerationRate="fast"
                                    bounces={false}
                                    scrollEventThrottle={16}
                                    onMomentumScrollEnd={handleYearMomentumEnd}
                                    getItemLayout={(_, index) => ({
                                        length: ITEM_HEIGHT,
                                        offset: ITEM_HEIGHT * index,
                                        index,
                                    })}
                                    contentContainerStyle={styles.wheelContent}
                                />
                            </View>

                            <View pointerEvents="none" style={styles.selectionOverlay} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
        gap: 10,
    },
    monthPill: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#ECECEC",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },
    monthText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#8D8D8D",
    },
    todayButton: {
        backgroundColor: "#1EA7FF",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    todayButtonText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#FFF",
    },
    daysRow: {
        paddingRight: 8,
        gap: 10,
    },
    dayCard: {
        width: 74,
        minHeight: 84,
        borderRadius: 18,
        backgroundColor: "#E7E7E7",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
    },
    dayCardActive: {
        backgroundColor: "#1EA7FF",
    },
    dayText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
        marginBottom: 4,
    },
    dayTextActive: {
        color: "#FFF",
    },
    dateText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#000",
    },
    dateTextActive: {
        color: "#FFF",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.28)",
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalCard: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 24,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E6E6E6",
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#111",
    },
    cancelText: {
        fontSize: 16,
        fontWeight: "400",
        color: "#7A7A7A",
    },
    doneText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1EA7FF",
    },
    wheelsWrapper: {
        height: PICKER_HEIGHT,
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingHorizontal: PICKER_SIDE_PADDING,
    },
    wheelContainer: {
        flex: 1,
        height: PICKER_HEIGHT,
    },
    wheelContent: {
        paddingVertical: ITEM_HEIGHT * 2,
    },
    wheelItem: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },
    wheelText: {
        fontSize: 24,
        fontWeight: "400",
        color: "#8D8D8D",
    },
    wheelTextActive: {
        color: "#111",
        fontWeight: "600",
    },
    selectionOverlay: {
        position: "absolute",
        left: PICKER_SIDE_PADDING,
        right: PICKER_SIDE_PADDING,
        top: ITEM_HEIGHT * 2,
        height: ITEM_HEIGHT,
        borderRadius: 12,
        backgroundColor: "rgba(242,242,242,0.55)",
        borderWidth: 1,
        borderColor: "#E8E8E8",
    },
});