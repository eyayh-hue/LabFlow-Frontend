import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// تنسيقات الـ PDF الاحترافية
const pdfStyles = StyleSheet.create({
  page: {
    padding: 35,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#1d5fd6",
    paddingBottom: 12,
    marginBottom: 20,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1d5fd6",
  },
  subLogo: {
    fontSize: 9,
    color: "#4a5d84",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#0b1f44",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    backgroundColor: "#f1f6ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 11,
    color: "#0b1f44",
  },
  label: {
    fontWeight: "bold",
    color: "#4a5d84",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#d5e1fa",
    borderWidth: 1,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#d5e1fa",
    borderBottomWidth: 1,
  },
  tableColHeader: {
    width: "33.33%",
    backgroundColor: "#e6efff",
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#0b3c9e",
    textAlign: "center",
  },
  tableCol: {
    width: "33.33%",
    padding: 8,
    fontSize: 10,
    color: "#0b1f44",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 35,
    right: 35,
    textAlign: "center",
    fontSize: 9,
    color: "#4a5d84",
    borderTopWidth: 1,
    borderTopColor: "#d5e1fa",
    paddingTop: 10,
  },
});

const MedicalReportPDF = ({ analysis }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <View>
          <Text style={pdfStyles.logo}>LabFlow</Text>
          <Text style={pdfStyles.subLogo}>Smart Laboratory Management</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 10, color: "#4a5d84" }}>
            Date:{" "}
            {analysis?.createdAt
              ? new Date(analysis.createdAt).toLocaleDateString("fr-FR")
              : "—"}
          </Text>
          <Text style={{ fontSize: 10, color: "#4a5d84" }}>
            Rapport Officiel
          </Text>
        </View>
      </View>

      <Text style={pdfStyles.title}>Compte Rendu d'Analyse Médicale</Text>

      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text>
            <Text style={pdfStyles.label}>N° Dossier : </Text>
            {analysis?.NumeroDossier || "—"}
          </Text>
          <Text>
            <Text style={pdfStyles.label}>Type d'analyse : </Text>
            {analysis?.TypeAnalyse || "—"}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text>
            <Text style={pdfStyles.label}>Heure de prélèvement : </Text>
            {analysis?.HeurePrelevement || "—"}
          </Text>
          <Text>
            <Text style={pdfStyles.label}>Statut : </Text>
            {analysis?.Statut || "—"}
          </Text>
        </View>
      </View>

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableRow}>
          <Text style={pdfStyles.tableColHeader}>Test</Text>
          <Text style={pdfStyles.tableColHeader}>Résultat</Text>
          <Text style={pdfStyles.tableColHeader}>Valeurs de référence</Text>
        </View>

        {analysis?.Tests?.length > 0 ? (
          analysis.Tests.map((t, i) => (
            <View style={pdfStyles.tableRow} key={i}>
              <Text style={pdfStyles.tableCol}>{t.testName}</Text>
              <Text style={pdfStyles.tableCol}>{t.ValeurResultat}</Text>
              <Text style={pdfStyles.tableCol}>{t.ValeurUsuelle}</Text>
            </View>
          ))
        ) : (
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCol, { width: "100%" }]}>
              Aucun résultat disponible.
            </Text>
          </View>
        )}
      </View>

      <Text style={pdfStyles.footer}>
        LabFlow - Système de Gestion de Laboratoire Médical | Document généré
        électroniquement et sécurisé © 2026
      </Text>
    </Page>
  </Document>
);

export default MedicalReportPDF;
