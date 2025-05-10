import {StyleSheet} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#f9fafb", // --color-background
        padding: 20,
        fontFamily: "Helvetica",
    },
    ticket: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        border: "1px solid #f3f4f6", // --color-borderContainer
        padding: 16,
        position: "relative",
        marginBottom: 12,
    },
    headerBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: "#059669", // --color-primary
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1f2937", // --color-textPrimary
        textTransform: "uppercase",
    },
    date: {
        fontSize: 9,
        color: "#4b5563", // --color-textSecondary
    },
    logo: {
        height: 40,
        marginBottom: 8,
    },
    info: {
        fontSize: 12,
        color: "#374151", // --color-textSecondary
        marginBottom: 8,
    },
    separator: {
        height: 1,
        backgroundColor: "#f3f4f6", // --color-borderContainer
        marginVertical: 8,
    },
    stations: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    stationGroup: {
        alignItems: "center",
        width: "45%",
    },
    stationName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    stationTime: {
        fontSize: 10,
        color: "#374151",
        marginTop: 4,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        fontSize: 11,
        color: "#374151",
    },
    optionsContainer: {
        marginTop: 8,
        marginBottom: 8,
    },
    optionsTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#059669", // --color-primary
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    optionBullet: {
        fontSize: 10,
        color: "#4b5563", // --color-textSecondary
        marginRight: 4,
    },
    optionText: {
        fontSize: 10,
        color: "#1f2937", // --color-textPrimary
        flex: 1,
    },
    footerText: {
        marginTop: 12,
        textAlign: "center",
        fontSize: 10,
        color: "#6b7280",
    },
    qrContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        padding: 16,
    },
    qrLabel: {
        fontSize: 9,
        color: "#059669", // --color-primary
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    qr: {
        width: 120,
        height: 120,
    },
});
