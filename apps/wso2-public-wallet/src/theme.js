// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { alpha } from "@mui/material";

// Color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "ffffff",
          200: "#e0e0e0",
          300: "#666666",
          400: "#3d3d3d",
          500: "#141414",
          600: "#000000",
        },
        primary: {
          100: "#FF5722",
        },
      }
    : {
        grey: {
          100: "#000000",
          200: "#141414",
          300: "#666666",
          400: "#a3a3a3",
          500: "#393E46",
          600: "#ffffff",
        },
        primary: {
          100: "#FD7014",
        },
      }),
});

// MUI theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              dark: colors.grey[300],
              main: colors.grey[200],
              light: colors.grey[200],
              contrastText: colors.grey[600],
            },
            background: {
              default: colors.grey[500],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
              contrastText: colors.grey[600],
            },
            secondary: {
              light: colors.grey[400],
              dark: colors.grey[300],
              main: colors.grey[200],
            },
            background: {
              default: colors.grey[600],
            },
            header: {
              header: "#F1F7FF",
            },
          }),
    },
    typography: {
      fontSize: 11,
      fontFamily: ["Poppins", "sans-serif"].join(","),
      h1: {
        fontSize: 40,
      },
      h2: {
        fontSize: 32,
      },
      h3: {
        fontSize: 24,
      },
      h4: {
        fontSize: 20,
      },
      h5: {
        fontSize: 16,
      },
      h6: {
        fontSize: 14,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {},
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              size: "small",
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(5px)",
          },
          paper: {
            width: "90vw",
            borderRadius: 4,
            maxHeight: "90vh",
            "& .MuiDialogTitle-root": {
              fontWeight: "bold",
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            fontSize: 12,
            pb: 0,
            height: `calc(100% - 40px)`,
            width: "100%",
            border: "none",
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
              backgroundColor: (theme) =>
                alpha(colors.grey[100], theme.palette.action.activatedOpacity),
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            ".MuiDataGrid-row:focus": {
              borderRadius: 0,
            },
            ".MuiDataGrid-row:focus-within": {
              borderRadius: 0,
            },
            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
              {
                display: "none",
              },
            ".MuiDataGrid-columnHeaderTitle": {
              fontSize: 13,
              fontWeight: "bold",
            },
          },
          columnHeader: {
            backgroundColor: alpha("#769FCD", 0.2),
            borderRadius: 0,
            mb: 2,
          },
        },
      },
    },
  };
};
