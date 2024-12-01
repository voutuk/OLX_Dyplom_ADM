using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Olx.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Add_Many_to_Many_Filter_FilterValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilterValue_Filter_FilterId",
                table: "FilterValue");

            migrationBuilder.DropIndex(
                name: "IX_FilterValue_FilterId",
                table: "FilterValue");

            migrationBuilder.DropColumn(
                name: "FilterId",
                table: "FilterValue");

            migrationBuilder.CreateTable(
                name: "FilterFilterValue",
                columns: table => new
                {
                    FiltersId = table.Column<int>(type: "integer", nullable: false),
                    ValuesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FilterFilterValue", x => new { x.FiltersId, x.ValuesId });
                    table.ForeignKey(
                        name: "FK_FilterFilterValue_FilterValue_ValuesId",
                        column: x => x.ValuesId,
                        principalTable: "FilterValue",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FilterFilterValue_Filter_FiltersId",
                        column: x => x.FiltersId,
                        principalTable: "Filter",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FilterFilterValue_ValuesId",
                table: "FilterFilterValue",
                column: "ValuesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FilterFilterValue");

            migrationBuilder.AddColumn<int>(
                name: "FilterId",
                table: "FilterValue",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FilterValue_FilterId",
                table: "FilterValue",
                column: "FilterId");

            migrationBuilder.AddForeignKey(
                name: "FK_FilterValue_Filter_FilterId",
                table: "FilterValue",
                column: "FilterId",
                principalTable: "Filter",
                principalColumn: "Id");
        }
    }
}
