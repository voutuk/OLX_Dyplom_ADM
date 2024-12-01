using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Olx.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Add_to_FilterValue_hullable_foreign_key : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilterValue_Filter_FilterId",
                table: "FilterValue");

            migrationBuilder.AlterColumn<int>(
                name: "FilterId",
                table: "FilterValue",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_FilterValue_Filter_FilterId",
                table: "FilterValue",
                column: "FilterId",
                principalTable: "Filter",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilterValue_Filter_FilterId",
                table: "FilterValue");

            migrationBuilder.AlterColumn<int>(
                name: "FilterId",
                table: "FilterValue",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FilterValue_Filter_FilterId",
                table: "FilterValue",
                column: "FilterId",
                principalTable: "Filter",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
