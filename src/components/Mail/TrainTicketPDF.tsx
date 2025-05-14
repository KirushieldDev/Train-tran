import React from "react";
import {Document, Page, View, Text, Image} from "@react-pdf/renderer";
import qrcode from "qrcode";
import fs from "fs";
import path from "path";
import {Option} from "@traintran/lib/options";
import {styles} from "@traintran/style/ticketPDF";
import {JourneySegment, Passenger} from "@traintran/context/CartContext";
import {formattedDate, formatDateTime} from "@traintran/utils/travel";

const logoSvg = fs.readFileSync(path.join(process.cwd(), "public", "TrainTran_logo.png"));
const logoDataUrl = `data:image/png;base64,${logoSvg.toString("base64")}`;

export interface TrainTicketPDFProps {
    passenger: Passenger;
    journeySegment: JourneySegment;
    options: Option[];
}

export default function TrainTicketPDF(props: TrainTicketPDFProps) {
    const {passenger, journeySegment} = props;

    async function getTicketQrDataUrl() {
        return await qrcode.toDataURL(JSON.stringify(props));
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.ticket}>
                    <View style={styles.headerBar} />
                    <View style={styles.header}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image style={styles.logo} src={logoDataUrl} />
                        <Text style={styles.title}>Billet de train</Text>
                        <Text style={styles.date}>{formattedDate(journeySegment.departureTime)}</Text>
                    </View>
                    <View style={styles.separator} />

                    <View style={styles.stations}>
                        <View style={styles.stationGroup}>
                            <Text style={styles.stationName}>{journeySegment.departureStation}</Text>
                            <Text style={styles.stationTime}>Départ {formatDateTime(journeySegment.departureTime)}</Text>
                        </View>
                        <View style={styles.stationGroup}>
                            <Text style={styles.stationName}>{journeySegment.arrivalStation}</Text>
                            <Text style={styles.stationTime}>Arrivée {formatDateTime(journeySegment.arrivalTime)}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.infoRow}>
                        <Text>Nom : {passenger.lastName}</Text>
                        <Text>Voiture : {passenger.carNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text>Prénom : {passenger.firstName}</Text>
                        <Text>Place : {passenger.seatNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text>Âge : {passenger.age}</Text>
                    </View>

                    <View style={styles.separator} />

                    {props.options.length > 0 && (
                        <View style={styles.optionsContainer}>
                            <Text style={styles.optionsTitle}>Option(s) choisie(s) :</Text>
                            {props.options.map(opt => (
                                <View key={opt.id} style={styles.optionRow}>
                                    <Text style={styles.optionBullet}>•</Text>
                                    <Text style={styles.optionText}>
                                        {opt.name} – {opt.description}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <Text style={styles.footerText}>Bon voyage et merci de votre confiance !</Text>
                </View>

                <View style={styles.qrContainer}>
                    <Text style={styles.qrLabel}>Votre QR Code</Text>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image style={styles.qr} src={getTicketQrDataUrl()} />
                </View>
            </Page>
        </Document>
    );
}
