import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import { EInvoiceType, type IInvoiceProps } from "./invoice-types";
import { supplier } from "$lib/billing.json";
import moment from "$lib/moment";

import MontserratRegular from "$lib/fonts/Montserrat-Regular.ttf";
// import MontserratMedium from "$lib/fonts/Montserrat-Medium.ttf";
import MontserratBold from "$lib/fonts/Montserrat-Bold.ttf";
import { fromCents } from "$lib/index";
// import MontserratExtraBold from "$lib/fonts/Montserrat-ExtraBold.ttf";
// import MontserratSemiBold from "$lib/fonts/Montserrat-SemiBold.ttf";
// import MontserratLight from "$lib/fonts/Montserrat-Light.ttf";

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
            fontWeight: 300,
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
            fontWeight: 400,
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
            fontWeight: 500,
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
            fontWeight: 600,
        },
    ],
});

Font.register({
    family: "Montserrat",
    fonts: [
        {
            src: MontserratRegular,
            fontWeight: 400,
        },
        // {
        //   src: MontserratMedium,
        //   fontWeight: 500,
        // },
        // {
        //   src: MontserratSemiBold,
        //   fontWeight: 600,
        // },
        {
            src: MontserratBold,
            fontWeight: 700,
        },
        // {
        //   src: MontserratExtraBold,
        //   fontWeight: 800,
        // },
    ],
});

const styles = StyleSheet.create({
    font: {
        fontFamily: "Roboto",
        fontSize: 11,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 4,
        padding: "30 18 0",
    },
    page: {
        padding: "15 18 30",
    },
    companyName: {
        fontFamily: "Montserrat",
        fontWeight: 700,
        fontSize: 20,
    },
    refId: {
        fontWeight: 500,
        fontSize: 18,
    },
    h2: {
        fontWeight: 600,
        fontSize: 15,
    },
    addresses: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 50,
    },
    address: {
        flexGrow: 0,
        margin: "0 10",
        width: "50%",
    },
    itemsTable: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 25,
    },
    item: {
        display: "flex",
        flexDirection: "row",
        borderColor: "gray",
        borderBottomWidth: 2,
        borderStyle: "solid",
        padding: "2 5",
        fontSize: "10px",
    },
    itemText0: {
        width: "9%",
        flexGrow: 0,
        padding: "0 3",
    },
    itemText1: {
        width: "15%",
        flexGrow: 0,
        padding: "0 3",
    },
    itemText2: {
        width: "20%",
        flexGrow: 0,
        padding: "0 3",
    },
    itemText3: {
        width: "25%",
        flexGrow: 0,
        padding: "0 3",
    },
    line: {
        backgroundColor: "gray",
        height: 2,
    },
    space: {
        height: 5,
    },
    totalPrice: {
        fontSize: 18,
        textAlign: "right",
        fontWeight: 600,
    },
});

export const PDFInvoice = ({ invoiceData }: IInvoiceProps) => {
    const { billing } = invoiceData || {};

    const totalPrice = invoiceData.items.reduce((prev, current) => {
        console.log({ prev, ...current });
        return prev + current.singlePrice * current.count;
    }, 0);

    return (
        <Document>
            <Page size="A4" style={styles.font}>
                <View style={styles.header}>
                    <Text style={styles.companyName}>
                        <Text>{invoiceData?.companyName}</Text>
                    </Text>
                    <Text style={styles.refId}>
                        {invoiceData.invoiceType === EInvoiceType.PRE_INVOICE
                            ? "Proforma faktura"
                            : invoiceData.invoiceType ===
                                EInvoiceType.INVOICE_TAX_DOC
                              ? "Faktura - daňový doklad"
                              : "Faktura"}{" "}
                        {invoiceData?.refId}
                    </Text>
                </View>
                <View style={styles.page}>
                    <View style={styles.addresses}>
                        <View style={styles.address}>
                            <Text style={styles.h2}>Dodavatel</Text>
                            <View style={styles.space} />
                            <Text>{supplier.name}</Text>
                            <Text>{supplier.line1}</Text>
                            <Text>{supplier.line2}</Text>
                            <View style={styles.space} />
                            <Text>IČO: {supplier.ine}</Text>
                            <Text>
                                {supplier.vat
                                    ? `DIČ: ${supplier.vat}`
                                    : "Neplátce DPH"}
                            </Text>
                            <Text>
                                Fyzická osoba zapsaná v živnostenském rejstříku
                            </Text>
                        </View>
                        <View style={styles.address}>
                            <Text style={styles.h2}>Odběratel</Text>
                            <View style={styles.space} />
                            <Text>{billing?.fullname}</Text>
                            <Text>{billing?.line1}</Text>
                            <Text>
                                {billing?.postal} {billing?.city}
                            </Text>
                            <View style={styles.space} />
                            {billing?.ine && <Text>IČO: {billing?.ine}</Text>}
                            {billing?.vat && <Text>DIČ: {billing?.vat}</Text>}
                            <View style={styles.space} />
                            <View style={styles.line} />
                            <View style={styles.space} />
                            {invoiceData?.issuedAt && (
                                <Text>
                                    Vystaveno dne:{" "}
                                    {moment(invoiceData?.issuedAt)
                                        .locale("cs")
                                        .format("l")}
                                </Text>
                            )}
                            {invoiceData?.paidAt && (
                                <Text>
                                    Datum UZP:{" "}
                                    {moment(invoiceData?.paidAt)
                                        .locale("cs")
                                        .format("l")}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.itemsTable}>
                        <View style={styles.item}>
                            <Text style={styles.itemText0}>Počet</Text>
                            <Text style={styles.itemText0}>MJ</Text>
                            <Text style={styles.itemText3}>Název položky</Text>
                            <Text style={styles.itemText1}>Cena za MJ</Text>
                            <Text style={styles.itemText2}>Celkem</Text>
                        </View>
                        {invoiceData?.items.map((item) => (
                            <View
                                style={styles.item}
                                key={item.name + item.count}
                            >
                                <Text style={styles.itemText0}>
                                    {item.count}
                                </Text>
                                <Text style={styles.itemText0}>
                                    {item.measurementUnit}
                                </Text>
                                <Text style={styles.itemText3}>
                                    {item.name}
                                </Text>
                                <Text style={styles.itemText1}>
                                    {fromCents(Number(item.singlePrice))}{" "}
                                    {item.currency || invoiceData?.currency}
                                </Text>
                                <Text style={styles.itemText2}>
                                    {fromCents(
                                        Number(item.count) *
                                            Number(item.singlePrice) || 0,
                                    )}{" "}
                                    {item.currency || invoiceData?.currency}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.totalPrice}>
                        Celkem: {fromCents(totalPrice)} {invoiceData?.currency}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};
