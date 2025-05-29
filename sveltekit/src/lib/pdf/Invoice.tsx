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
import moment from "$lib/moment";

import { type IBilling } from "./invoice-types";

import Roboto400 from "./fonts/roboto-400.ttf";
import Roboto500 from "./fonts/roboto-500.ttf";
import Roboto600 from "./fonts/roboto-600.ttf";

import Roboto400Italic from "./fonts/roboto-400-italic.ttf";
import Roboto500Italic from "./fonts/roboto-500-italic.ttf";
import Roboto600Italic from "./fonts/roboto-600-italic.ttf";

import { fromCents } from "./utils";

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: Roboto400,
            fontWeight: 400,
            fontStyle: "normal",
        },
        {
            src: Roboto400Italic,
            fontWeight: 400,
            fontStyle: "italic",
        },
        {
            src: Roboto500,
            fontWeight: 500,
            fontStyle: "normal",
        },
        {
            src: Roboto500Italic,
            fontWeight: 500,
            fontStyle: "italic",
        },
        {
            src: Roboto600,
            fontWeight: 600,
            fontStyle: "normal",
        },
        {
            src: Roboto600Italic,
            fontWeight: 600,
            fontStyle: "italic",
        },
    ],
});

const styles = StyleSheet.create({
    font: {
        fontFamily: "Roboto",
        fontSize: 11,
    },
    page: {
        display: "flex",
        paddingBottom: 100,
        justifyContent: "space-between",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 4,
        padding: "30 18 10",
    },
    footer: {
        marginBottom: -80,
        padding: "0 18",
    },
    endInfo: {
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "30 18",
    },
    companyName: {
        fontWeight: 600,
        fontSize: 18,
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
        marginBottom: 30,
    },
    address: {
        flexGrow: 0,
        margin: "0 10",
        width: "50%",
    },
    itemsTable: {
        padding: "0 10 30",
    },
    item: {
        flexDirection: "row",
        borderColor: "gray",
        borderBottomWidth: 1,
        borderStyle: "solid",
        padding: "2 5",
        fontSize: 10,
    },
    itemCount: {
        width: "6%",
        padding: "0 3",
    },
    itemMeasurementUnit: {
        width: "6%",
        padding: "0 3",
    },
    itemPriceForMU: {
        width: "12%",
        padding: "0 3",
    },
    itemTotal: {
        width: "18%",
        padding: "0 3",
    },
    itemVat: {
        width: "10%",
        padding: "0 3",
    },
    itemVatPercentage: {
        width: "7%",
        padding: "0 3",
    },
    itemTotalWithVat: {
        width: "18%",
        padding: "0 3",
    },
    itemName: {
        padding: "0 3",
        flex: 1,
        minWidth: 1,
    },
    line: {
        backgroundColor: "gray",
        height: 1,
    },
    space: {
        height: 5,
    },
    totalContainer: {
        padding: "15 10",
    },
    totalPrice: {
        fontSize: 18,
        textAlign: "right",
        fontWeight: 600,
    },
    rounded: {
        textAlign: "right",
    },
    textSecondary: {
        color: "#6e6e6e",
    },
    italic: { fontStyle: "italic" },
    totalRow: {
        display: "flex",
        flexDirection: "row",
        padding: "2 5",
        fontSize: 10,
        marginTop: 10,
    },
});

export const PDFInvoice = ({ invoiceData }: IInvoiceProps) => {
    const withoutVatText = "bez DPH";

    // const breakAtIndexes: number[] = [];

    // {
    //     let totalCharacters =
    //         (invoiceData.customFooterText?.length || 0) +
    //         (invoiceData.customTextUnderSupplier?.length || 0) +
    //         (invoiceData.reverseCharge ? 50 : 0);

    //     invoiceData.items.forEach((v, i) => {
    //         totalCharacters += v.name.length;

    //         if (totalCharacters > 100) {
    //         }
    //     });
    // }

    return (
        <Document>
            <Page size="A4" style={{ ...styles.font, ...styles.page }}>
                <View style={{ flex: 1 }}>
                    <View fixed style={styles.header}>
                        <Text style={styles.companyName}>
                            <Text>{invoiceData?.companyName}</Text>
                        </Text>
                        <Text style={styles.refId}>
                            <InvoiceName
                                invoiceType={invoiceData.invoiceType}
                                refId={invoiceData.refId}
                            />
                        </Text>
                    </View>
                    <View style={styles.addresses}>
                        <View style={styles.address}>
                            <Text style={styles.h2}>Dodavatel</Text>
                            <BillingView
                                supplier
                                billing={invoiceData.supplierBilling}
                            />

                            <View style={styles.space} />

                            {invoiceData.isSupplierSelfEmployed ? (
                                <Text style={styles.textSecondary}>
                                    Fyzická osoba zapsaná v živnostenském
                                    rejstříku
                                </Text>
                            ) : (
                                <Text style={styles.textSecondary}>
                                    {invoiceData.customTextUnderSupplier}
                                </Text>
                            )}

                            {(invoiceData.paymentType ||
                                invoiceData.paymentInfo) && (
                                <>
                                    <View style={styles.space} />
                                    <View style={styles.line} />
                                    <View style={styles.space} />
                                </>
                            )}

                            {invoiceData.paymentType && (
                                <Text>
                                    Způsob platby:{" "}
                                    {breakText(invoiceData.paymentType)}
                                </Text>
                            )}
                            {invoiceData.paymentInfo && (
                                <Text>{invoiceData.paymentInfo}</Text>
                            )}
                        </View>
                        <View style={styles.address}>
                            <Text style={styles.h2}>Odběratel</Text>
                            <BillingView billing={invoiceData.billing} />

                            {(invoiceData?.issuedAt ||
                                invoiceData?.paidAt ||
                                invoiceData?.pickedUpAt ||
                                invoiceData?.paymentDueDate) && (
                                <>
                                    <View style={styles.space} />
                                    <View style={styles.line} />
                                    <View style={styles.space} />
                                </>
                            )}

                            <View style={{ fontSize: 10 }}>
                                {invoiceData?.issuedAt && (
                                    <Text>
                                        <Text style={styles.italic}>
                                            Datum vystavení:{" "}
                                        </Text>
                                        {moment(invoiceData?.issuedAt)
                                            .locale("cs")
                                            .format("l")}
                                    </Text>
                                )}
                                {invoiceData?.paidAt && (
                                    <Text>
                                        <Text style={styles.italic}>
                                            Datum uskut. zdaň. plnění:{" "}
                                        </Text>
                                        {moment(invoiceData?.paidAt)
                                            .locale("cs")
                                            .format("l")}
                                    </Text>
                                )}
                                {invoiceData?.pickedUpAt && (
                                    <Text>
                                        <Text style={styles.italic}>
                                            Datum převzetí:{" "}
                                        </Text>
                                        {moment(invoiceData?.pickedUpAt)
                                            .locale("cs")
                                            .format("l")}
                                    </Text>
                                )}
                                {invoiceData?.paymentDueDate && (
                                    <Text>
                                        <Text style={styles.italic}>
                                            Datum splatnosti:{" "}
                                        </Text>
                                        {moment(invoiceData?.paymentDueDate)
                                            .locale("cs")
                                            .format("l")}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                    <View wrap style={styles.itemsTable}>
                        <View
                            fixed
                            style={{
                                ...styles.item,
                                ...styles.italic,
                                fontWeight: 500,
                            }}
                        >
                            <Text style={styles.itemName}>Název položky</Text>
                            <Text style={styles.itemCount}>Počet</Text>
                            <Text style={styles.itemMeasurementUnit}>MJ</Text>
                            <Text style={styles.itemPriceForMU}>
                                Cena za MJ
                            </Text>
                            <Text style={styles.itemTotal}>
                                Cena {invoiceData.countVat && withoutVatText}
                            </Text>
                            {invoiceData.countVat && (
                                <>
                                    <Text style={styles.itemVat}>DPH</Text>
                                    <Text style={styles.itemVatPercentage}>
                                        DPH %
                                    </Text>
                                    <Text style={styles.itemTotalWithVat}>
                                        Cena s DPH
                                    </Text>
                                </>
                            )}
                        </View>
                        {invoiceData.items.map((item) => (
                            <View
                                wrap={false}
                                style={styles.item}
                                key={item.name + item.count + item.id}
                            >
                                <Text style={styles.itemName}>
                                    {breakText(item.name)}
                                </Text>
                                <Text style={styles.itemCount}>
                                    {breakText(item.count)}
                                </Text>
                                <Text style={styles.itemMeasurementUnit}>
                                    {breakText(item.measurementUnit)}
                                </Text>
                                <Text style={styles.itemPriceForMU}>
                                    {breakText(
                                        fromCents(Number(item.singlePrice)),
                                    )}{" "}
                                    {/* {item.currency || invoiceData?.currency} */}
                                </Text>
                                <Text style={styles.itemTotal}>
                                    {breakText(fromCents(item.total || 0))}{" "}
                                    {/* {item.currency || invoiceData?.currency} */}
                                </Text>
                                {invoiceData.countVat && (
                                    <>
                                        <Text style={styles.itemVat}>
                                            {breakText(fromCents(item.vat))}
                                        </Text>
                                        <Text style={styles.itemVatPercentage}>
                                            {breakText(item.vatPercentage)}
                                        </Text>
                                        <Text style={styles.itemTotalWithVat}>
                                            {breakText(
                                                fromCents(item.totalWithVat),
                                            )}
                                        </Text>
                                    </>
                                )}
                            </View>
                        ))}
                        <View wrap={false} style={styles.totalRow}>
                            <Text
                                style={{
                                    ...styles.itemCount,
                                    ...styles.italic,
                                    fontWeight: 600,
                                }}
                            >
                                Celkem:
                            </Text>
                            <Text style={styles.itemMeasurementUnit}></Text>
                            <Text style={styles.itemName}></Text>
                            <Text style={styles.itemPriceForMU}></Text>
                            <Text style={styles.itemTotal}>
                                {fromCents(invoiceData.totalPriceWithoutVat)}
                            </Text>
                            {invoiceData.countVat && (
                                <>
                                    <Text style={styles.itemVat}>
                                        {fromCents(invoiceData.totalVat)}
                                    </Text>
                                    <Text
                                        style={styles.itemVatPercentage}
                                    ></Text>
                                    <Text style={styles.itemTotalWithVat}>
                                        {fromCents(invoiceData.totalPrice)}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                    <View wrap={false} style={styles.totalContainer}>
                        {invoiceData.roundTotal && (
                            <Text style={styles.rounded}>
                                <Text style={{ ...styles.italic }}>
                                    Zaokrouhlení:
                                </Text>{" "}
                                {fromCents(invoiceData.roundedTotalPriceBy)}{" "}
                                {invoiceData?.currency}
                            </Text>
                        )}
                        <Text style={styles.totalPrice}>
                            <Text style={{ fontWeight: 500, ...styles.italic }}>
                                Celkem k platbě:
                            </Text>{" "}
                            {fromCents(invoiceData.roundedTotalPrice)}{" "}
                            {invoiceData?.currency}
                        </Text>
                    </View>
                    <View wrap={false} style={styles.endInfo}>
                        <Text>{invoiceData.customFooterText}</Text>
                    </View>
                </View>

                <View fixed style={styles.footer}>
                    {invoiceData?.reverseCharge && (
                        <>
                            <View style={styles.line} />
                            <View style={styles.space} />
                            <Text style={{ paddingLeft: 5 }}>
                                Reverse charge - daň odvede zákazník
                            </Text>
                            <View style={styles.space} />
                            <View style={styles.line} />
                            <View style={{ ...styles.space, height: 10 }} />
                        </>
                    )}
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text>
                            <InvoiceName
                                invoiceType={invoiceData.invoiceType}
                                refId={invoiceData.refId}
                            />
                        </Text>
                        <Text
                            render={({ pageNumber, totalPages }) => (
                                <>
                                    Strana {pageNumber} z {totalPages}
                                </>
                            )}
                        />
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const BillingView = ({
    billing,
    supplier,
}: {
    billing: IBilling;
    supplier?: boolean;
}) => {
    return (
        <>
            <View style={styles.space} />
            <Text style={{ fontWeight: 500 }}>{billing?.fullname}</Text>
            <Text style={styles.textSecondary}>{billing?.line1}</Text>
            <Text style={styles.textSecondary}>
                {billing?.postal} {billing?.city}
            </Text>
            <Text style={styles.textSecondary}>{billing?.country}</Text>
            <View style={styles.space} />
            {billing?.ine && (
                <Text>
                    <Text style={styles.italic}>IČO:</Text> {billing?.ine}
                </Text>
            )}
            {supplier ? (
                <Text>
                    {billing.vat ? (
                        <>
                            <Text style={styles.italic}>DIČ:</Text>{" "}
                            {billing.vat}
                        </>
                    ) : (
                        <Text style={styles.italic}>Neplátce DPH</Text>
                    )}
                </Text>
            ) : (
                billing?.vat && (
                    <Text>
                        <Text style={styles.italic}>DIČ:</Text> {billing?.vat}
                    </Text>
                )
            )}
        </>
    );
};

const InvoiceName = ({
    invoiceType,
    refId,
}: {
    invoiceType: EInvoiceType;
    refId: string;
}) => (
    <>
        {invoiceType === EInvoiceType.PRE_INVOICE
            ? "Proforma faktura"
            : invoiceType === EInvoiceType.INVOICE_TAX_DOC
              ? "Faktura - daňový doklad"
              : "Faktura"}{" "}
        {refId}
    </>
);

function breakText(text: string | number | undefined) {
    return String(text)
        .split("")
        .map((s, idx) => {
            return <Text key={String(text) + idx}>{s}</Text>;
        });
}
