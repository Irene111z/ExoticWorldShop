import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Accordion, AccordionSummary, AccordionDetails, Typography, CssBaseline } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "@fontsource/montserrat"; // Підключаємо шрифт Montserrat

// Створюємо тему з Montserrat
const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});

const categories = [
  {
    title: "Птахи",
    subcategories: [],
  },
  {
    title: "Гризуни",
    subcategories: [
      {
        title: "Їжа",
        subcategories: [],
      },
      {
        title: "Клітки",
        subcategories: [],
      },
      {
        title: "Аксесуари в клітку",
        subcategories: [
          { title: "Гамаки", subcategories: [] },
          { title: "Будиночки", subcategories: [] },
          { title: "Полички", subcategories: [] },
        ],
      },
      { title: "Іграшки", subcategories: [] },
      { title: "Наповнювач", subcategories: [] },
      { title: "Переноски", subcategories: [] },
    ],
  },
  {
    title: "Рептилії",
    subcategories: [],
  },
  {
    title: "Ссавці",
    subcategories: [],
  },
];

const CategoryAccordion = ({ category }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpand}
      disableGutters
      sx={{
        boxShadow: "none",
        "&:before": {
          display: "none",
        },
        "& .MuiAccordionSummary-root": {
          borderTop: "none",
        },
      }}
    >
      <AccordionSummary
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>{category.title}</Typography>
        {category.subcategories.length > 0 && (
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        )}
      </AccordionSummary>
      {category.subcategories.length > 0 && (
        <AccordionDetails sx={{ padding: "0 16px" }}>
          <div style={{ paddingLeft: "20px" }}>
            {category.subcategories.map((subcat, index) => (
              <CategoryAccordion key={index} category={subcat} />
            ))}
          </div>
        </AccordionDetails>
      )}
    </Accordion>
  );
};

const CategoryList = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="category-list">
        {categories.map((category, index) => (
          <CategoryAccordion key={index} category={category} />
        ))}
      </div>
    </ThemeProvider>
  );
};

export default CategoryList;
